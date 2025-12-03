import mongoose from 'mongoose';

describe('User Model', () => {
    beforeAll(() => {
        jest.spyOn(mongoose, 'connect').mockResolvedValue(mongoose as any);
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    it('should define User schema', () => {
        const { User } = require('../User');

        expect(User).toBeDefined();
        expect(User.modelName).toBe('User');
    });

    it('should have schema with required fields', () => {
        const { User } = require('../User');
        const schema = User.schema;

        expect(schema.path('email')).toBeDefined();
        expect(schema.path('username')).toBeDefined();
        expect(schema.path('password')).toBeDefined();
        expect(schema.path('name.first')).toBeDefined();
        expect(schema.path('name.last')).toBeDefined();
    });

    it('should have comparePassword method', () => {
        const { User } = require('../User');
        const schema = User.schema;

        expect(schema.methods.comparePassword).toBeDefined();
        expect(typeof schema.methods.comparePassword).toBe('function');
    });
});
