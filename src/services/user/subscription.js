const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

class SubscriptionService {
    constructor(subscriptionRepository, userRepository) {
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
            return { status: 404, message: "No public key found" };
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
            return { status: 404, message: "No plan found" };
        }
    };

    async getActivePlan(subscriptionId) {
        const currentPlan = await this.subscriptionRepository.getActivePlan(subscriptionId);

        if (!currentPlan) {
            return { status: 404, message: "No active plan found" };
        }

        return {
            status: 200,
            message: "Found active plan",
            data: {
                currentPlan
            }
        };
    };

    async testWebhook(payload, sig) {
        const endpointSecret = process.env.WEBHOOK_SECRET;

        let event;

        // console.log(payload, sig);

        try {
            event = await stripe.webhooks.constructEvent(payload, sig, endpointSecret);
        } catch (err) {
            return { status: 400, message: `Webhook Error: ${err.message}` };
        }

        console.log(event);
    };
};

module.exports = SubscriptionService;
