import * as url from 'cloudinary-microurl';
const CLOUD_NAME = (window as any).Keystone.cloudinary.cloud_name;

/*
	Take a cloudinary public id + options object
	and return a url
*/
export function cloudinaryResize(publicId, options = {}) {
    if (!publicId || !CLOUD_NAME) return false;

    return url(publicId, {
        cloud_name: CLOUD_NAME, // single cloud for the admin UI
        quality: 80, // 80% quality, which ~halves image download size
        ...options,
    });
}
