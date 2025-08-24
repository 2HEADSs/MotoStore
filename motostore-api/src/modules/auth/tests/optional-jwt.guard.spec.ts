import { OptionalJwtGuard } from "../guards/optional-jwt/optional-jwt.guard";


describe('OptionalJwtGuard', () => {
  it('should be defined', () => {
    expect(new OptionalJwtGuard()).toBeDefined();
  });
});
