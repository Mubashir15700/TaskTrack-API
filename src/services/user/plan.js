// stripe
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const planRepository = require("../../repositories/plan");
const serverErrorHandler = require("../../utils/serverErrorHandler");

class PlanService {
    async getPlans() {
        try {
            const plans = await planRepository.getPlans();

            if (!plans.length) {
                return { status: 400, message: "No plans found" };
            }

            return {
                status: 201,
                message: "Found plans",
                data: {
                    plans
                }
            };
        } catch (error) {
            return serverErrorHandler("An error occurred during fetching plans: ", error);
        }
    };

    async getPlan(id) {
        try {
            const plan = await planRepository.getPlan(id);

            if (!plan) {
                return { status: 400, message: "No plan found" };
            }

            return {
                status: 201,
                message: "Found plan",
                data: {
                    plan
                }
            };
        } catch (error) {
            return serverErrorHandler("An error occurred during fetching plan: ", error);
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
                    return_url: "http://localhost:5173/manage-subscription",
                });
                return { status: 409, redirectUrl: stripeSession.url };
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
            success_url: "http://localhost:5173/success",
            cancel_url: "http://localhost:5173/cancel",
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
            status: 201,
            data: {
                id: session.id
            }
        };
    };

    async saveSubscriptionResult(sessionId) {
        try {
            const session = await stripe.checkout.sessions.retrieve(sessionId);

            if (session.payment_status === "paid") {
                await planRepository.saveSubscription(
                    session.metadata.userId, sessionId, session.metadata.planId
                );

                return session;
            } else {
                return { status: 400, message: "No plan found" };
            }
        } catch (error) {
            return serverErrorHandler("Error fetching payment details: ", error);
        }
    };
};

module.exports = new PlanService();
