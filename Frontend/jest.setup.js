// jest.setup.js
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Add other potential missing globals
global.fetch = jest.fn();
global.Headers = jest.fn();
global.Request = jest.fn();
global.Response = jest.fn();