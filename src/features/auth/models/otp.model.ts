import { Schema } from "mongoose"
import { attemptLimitingPlugin } from "./_plugins/attemp-limiting.plugin"
import { config } from "../../../core/config/config"
import { IOTPModel } from "../types/otp"
import { BaseModel, createBaseSchema } from "../../../framework/database/mongoose/base/_models/base.model"

const OTP_MODEL_NAME = "OTP"

const otpSchema = createBaseSchema<IOTPModel>(
    {
        code: {
            type: String,
            required: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        used: {
            type: Boolean,
            default: false,
        },
        isFresh: {
            type: Boolean,
            default: true,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
        purpose: {
            type: String,
            enum: Object.keys(config.otp.purposes),
            required: true,
        },
        attempts: {
            type: Number,
            default: 0,
        },
    },
    {
        excludePlugins: ["softDelete"],
        includePlugins: [[attemptLimitingPlugin, { maxAttempts: 5 }]],
        modelName: OTP_MODEL_NAME,
    },
)

const OTPModel = new BaseModel<IOTPModel>(OTP_MODEL_NAME, otpSchema).getModel()

export default OTPModel
