import DriverModel from "../models/drivers.model";

interface DriverPayload {
    name: string;
    nationality: string;
}

class DriverService {
    async upsertByName(payload: DriverPayload) {
        return await DriverModel.findOneAndUpdate({ name: payload.name }, { ...payload }, { new: true, upsert: true });
    }
}

export default new DriverService();