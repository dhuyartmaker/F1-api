import * as overwriteDevConfig from './dev.config.json';
import * as overwriteDefaultConfig from './config.json';

const configDefault = {
}
const env = process.env.NODE_ENV || "pro";
console.log("===env===", env);

export default {
    config: {
        ...configDefault,
        ...(env === "dev" ? overwriteDevConfig : overwriteDefaultConfig),
    }
}