import * as mongoose from 'mongoose';

export function removeModel(modelName) {
	delete mongoose.models[modelName];
	delete (mongoose as any).modelSchemas[modelName];
}
