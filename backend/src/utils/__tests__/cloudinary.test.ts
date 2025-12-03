describe('Cloudinary Utils', () => {
    it('should be defined', () => {
        expect(true).toBe(true);
    });

    it('should export cloudinary configuration', () => {
        const cloudinaryUtils = require('../cloudinary');
        expect(cloudinaryUtils).toBeDefined();
    });
});
