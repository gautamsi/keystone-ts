import * as mongoose from 'mongoose';

export function removeModel(modelName) {
	delete mongoose.models[modelName];
	delete mongoose.modelSchemas[modelName];
}
