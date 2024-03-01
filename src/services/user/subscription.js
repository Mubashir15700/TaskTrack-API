const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

class SubscriptionService {
    constructor (subscriptionRepository, userRepository) {
        this.subscriptionRepository = subscriptionRepository;
        this.userRepository = userRepository;
    };

    async getStripePublicKey() {
        const stripePublicKey = process.env.STRIPE_PUBLIC_KEY;

        if (stripePublicKey) {
            return {
                status: 200,
                data: {
                    stripePublicKey
                }
            };
        } else {
            throw new Error("No public key found");
        }
    };

    async createSubscription(userData, planData) {
        const userEmail = userData.email;
        let customer;
        const auth0UserId = userData.userId;

        // Try to retrieve an existing customer by email
        const existingCustomers = await stripe.customers.list({
            email: userEmail,
            limit: 1,
        });

        if (existingCustomers.data.length > 0) {
            customer = existingCustomers.data[0];

            // Check if the customer already has an active subscription
            const subscriptions = await stripe.subscriptions.list({
                customer: customer.id,
                status: "active",
                limit: 1,
            });

            if (subscriptions.data.length > 0) {
                // Customer already has an active subscription, send them to biiling portal to manage subscription
                const stripeSession = await stripe.billingPortal.sessions.create({
                    customer: customer.id,
                    return_url: `${process.env.CORS_ORIGIN}/manage-subscription`,
                });
                return {
                    status: 409,
                    message: "already has a plan",
                    data: {
                        redirectUrl: stripeSession.url
                    }
                };
            }
        } else {
            customer = await stripe.customers.create({
                email: userEmail,
                metadata: {
                    userId: userData.userId,
                },
            });
        }

        // Now create the Stripe checkout session with the customer ID
        const session = await stripe.checkout.sessions.create({
            success_url: `${process.env.CORS_ORIGIN}/success`,
            cancel_url: `${process.env.CORS_ORIGIN}/cancel`,
            payment_method_types: ["card"],
            // test visa card - 4000003560000008 
            mode: "subscription",
            billing_address_collection: "required",
            line_items: [
                {
                    price_data: {
                        currency: "inr",
                        product_data: {
                            name: planData.name,
                            description: planData.description
                        },
                        unit_amount: planData.amount * 100,
                        recurring: {
                            interval: planData.type === "monthly" ? "month" : "year",
                        },
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                userId: auth0UserId,
                planId: planData._id
            },
            customer: customer.id,
        });

        return {
            status: 200,
            data: {
                id: session.id
            }
        };
    };

    async saveSubscriptionResult(sessionId) {
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === "paid") {
            const saveResult = await this.subscriptionRepository.saveSubscription(
                session.metadata.userId, sessionId, session.metadata.planId
            );

            await this.userRepository.updateUserSubscription(
                session.metadata.userId, saveResult
            );

            return {
                status: 200,
            };
        } else {
            throw new Error("No plan found");
        }
    };

    async getActivePlan(subscriptionId) {
        const currentPlan = await this.subscriptionRepository.getActivePlan(subscriptionId);

        if (!currentPlan) {
            throw new Error("No active plan found");
        }

        return {
            status: 200,
            message: "Found active plan",
            data: {
                currentPlan
            }
        };
    };

    async cancelActivePlan(sessionId, userId) {
        // Retrieve the Checkout Session from Stripe
        const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

        // Extract the subscription ID from the Checkout Session
        const subscriptionId = checkoutSession.subscription;

        if (!subscriptionId) {
            console.error("No subscription associated with the provided sessionId.");
            return { status: 400, error: "No subscription associated with the provided sessionId." };
        }

        const canceledSubscription = await stripe.subscriptions.cancel(subscriptionId);

        // Check if the subscription has been canceled
        if (canceledSubscription.status === "canceled") {

            await this.subscriptionRepository.cancelSubscription(sessionId);

            await this.userRepository.updateUserSubscription(userId);

            console.log(`Subscription ${subscriptionId} has been canceled immediately.`);
            return { status: 200, message: `Subscription ${subscriptionId} canceled immediately.` };
        } else {
            console.error(`Failed to cancel subscription ${subscriptionId} immediately.`);
            throw new Error(`Failed to cancel subscription ${subscriptionId} immediately.`);
        }
    };
};

module.exports = SubscriptionService;
