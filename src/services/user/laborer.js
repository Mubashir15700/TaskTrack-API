const calculateDistance = require("../../utils/calculateDistance");

class LaborerService {
    constructor(userRepository, laborerRepository, requestRepository, reasonRepository) {
        this.userRepository = userRepository;
        this.laborerRepository = laborerRepository;
        this.requestRepository = requestRepository;
        this.reasonRepository = reasonRepository;
    };

    async getLaborers(userId, page, lat, lon) {
        const pageSize = 10;

        const laborers = await this.laborerRepository.getLaborers(userId, null, page, pageSize);

        let laborersWithDistances;
        if (lat && lon) {
            // Calculate distances for each laborer
            laborersWithDistances = laborers.map(laborer => {
                const laborerLat = laborer.location?.latitude;
                const laborerLon = laborer.location?.longitude;
                // console.log(laborerLat, laborerLon);
                // Check if laborer location exists
                if (laborerLat !== undefined && laborerLon !== undefined) {
                    const distance = calculateDistance(lat, lon, laborerLat, laborerLon);
                    return { ...laborer, distance };
                } else {
                    // Handle cases where laborer location is undefined
                    return { ...laborer, distance: Infinity }; // Set distance to Infinity or any other value as desired
                }
            });

            // Sort laborers based on distance
            laborersWithDistances.sort((a, b) => a.distance - b.distance);
        }

        const totalLaborers = await this.laborerRepository.getLaborersCount(userId);
        const totalPages = Math.ceil(totalLaborers / pageSize);

        return {
            status: 200,
            message: "get laborers success",
            data: {
                laborers: (lat && lon) ? laborersWithDistances : laborers,
                totalPages
            }
        };
    };

    async getLaborer(id) {
        const laborer = await this.laborerRepository.getLaborer(id);

        return {
            status: 200,
            message: "get laborer success",
            data: {
                laborer
            }
        };
    };

    async sendRequest(data) {
        // Cancel previous request if it exists
        await this.requestRepository.cancelRequest(data.userId);

        if (Object.keys(data.userData).length) {
            const { id, ...updateObject } = data.userData;
            // Now, updateObject contains all properties except id
            await this.userRepository.updateUser(data.userData.id, updateObject);
        }

        // Extract userData from data
        const { userData, ...restOfData } = data;
        // Now, restOfData contains everything except userData
        await this.requestRepository.saveRequest(restOfData);

        return {
            status: 200,
            message: "send become laborer request success"
        };
    };

    async getPrevRequest(userId) {
        const request = await this.requestRepository.getPrevRequest(userId);

        const data = {
            request
        };

        if (request?.status === "rejected") {
            const rejectReason = await this.reasonRepository.findBlockReason(
                userId, "admin_reject_laborer_request"
            );
            data.reason = rejectReason.reason;
        }

        return {
            status: 200,
            message: "found prev become laborer request",
            data
        };
    };

    async updateRequest(data) {
        let updatedProfile;
        if (Object.keys(data.userData).length) {
            const { id, ...updateObject } = data.userData;
            // Now, updateObject contains all properties except id
            updatedProfile = await this.userRepository.updateUser(data.userData.id, updateObject);
        }

        // Extract userData from data
        const { userData, ...restOfData } = data;
        // Now, restOfData contains everything except userData

        const updatedRequest = await this.requestRepository.updateRequest({ ...restOfData, status: "pending" });

        const response = {
            status: 200,
            message: "send become laborer request success",
            data: {
                updatedRequest,
            }
        };

        // Check if updatedProfile has values before adding it to the response
        if (updatedProfile && Object.keys(updatedProfile).length) {
            response.data.updatedProfile = updatedProfile;
        }

        return response;
    };

    async cancelRequest(userId) {
        const cancelResult = await this.requestRepository.cancelRequest(userId);

        return {
            status: 200,
            message: "cancel become laborer request success",
            data: {
                cancelResult,
            }
        };
    };
};

module.exports = LaborerService;
