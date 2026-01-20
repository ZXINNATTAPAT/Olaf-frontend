import { RegisterRequestDTO, LoginRequestDTO } from './dto';

test('RegisterRequestDTO structure is defined', () => {
  expect(RegisterRequestDTO).toBeDefined();
  expect(RegisterRequestDTO).toHaveProperty('username');
  expect(RegisterRequestDTO).toHaveProperty('email');
  expect(RegisterRequestDTO).toHaveProperty('password');
});

test('LoginRequestDTO structure is defined', () => {
  expect(LoginRequestDTO).toBeDefined();
  expect(LoginRequestDTO).toHaveProperty('email');
  expect(LoginRequestDTO).toHaveProperty('password');
});
