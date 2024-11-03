import { Schema, model, Document } from 'mongoose';

export interface IGuild extends Document {
    guildId: string;
    musicChannelId?: string;
    djRoleId?: string | undefined;

    registeredBy: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const GuildSchema = new Schema<IGuild>({
    guildId: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    musicChannelId: {
        type: String,
        required: false,
        unique: true,
    },
    djRoleId: {
        type: String,
        required: false,
        unique: false,
        index: false,
    },

    registeredBy: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

GuildSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

GuildSchema.pre('updateOne', function (next) {
    this.set({ updatedAt: new Date() });
    next();
});

GuildSchema.pre('findOneAndUpdate', function (next) {
    this.set({ updatedAt: new Date() });
    next();
});

export default model<IGuild>('Guild', GuildSchema);