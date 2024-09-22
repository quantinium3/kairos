import { getUserInfo, invalidateRefreshToken, login, register } from '../db/crudOperation/user.crud.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const options = {
  httpOnly: true,
  secure: true,
}
/*




Update User Profile
PUT /api/v1/users/profile: Update user details like email, username, etc.
Delete User

DELETE /api/v1/users/profile: Remove the user account.
Password Reset

POST /api/v1/users/reset-password: Initiate a password reset process.
Change Password

PUT /api/v1/users/change-password: Update the user's password.
 */
/*
 * User Registration
 * POST /api/v1/users/register: Create a new user.
 */
export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if ([username, email, password].some((field) => !field?.trim())) {
    throw new apiError(400, "All fields are required");
  }

  try {
    const id = await register(username, email, password);
    res.status(201).json(new apiResponse(201, { userId: id }, "User Created Successfully"));
  } catch (err) {
    console.error('Error while registering user:', err);
    throw new apiError(500, "Couldn't register user", err);
  }
});

/*
 * User Login 
 * POST /api/v1/users/login: Authenticate a user and issue a token.
*/

export const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email) {
    throw new apiError(400, "At least one of username or email is required");
  }

  if (!password) {
    throw new apiError(401, "Password is required")
  }

  const identifier = username || email;
  try {
    const { accessToken, refreshToken } = await login(identifier, password)
    return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(
      new apiResponse(200, { accessToken, refreshToken }, "User logged in successfuly")
    )
  } catch (err) {
    console.error("Error while logging in user");
    throw new apiError(500, "Couldn't login User");
  }
})

/* 
 * User Logout 
 * POST /api/v1/users/logout: Invalidate the user's token. 
 */

export const logoutUser = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new apiError(401, "No refreshToken found");
  }

  try {
    const result = await invalidateRefreshToken(refreshToken);
    return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).json(
      new apiResponse(200, { result: result }, "User logged out")
    )
  } catch (err) {
    console.error("Error while logging out user")
    throw new apiError(500, "Couldn't log out user")
  }
})



/* Get User Profile
 *GET /api/v1/users/profile: Retrieve the logged-in user's profile information. 
 */

export const getUserProfile = asyncHandler(async (req, res) => {
  const { username, email } = req.body;
  if (!username || !email) {
    throw new apiError(401, "At least one of the username or the enail is needed");
  }

  const identifier = username || email;
  try {
    const user = await getUserInfo(identifier);
    return res.status(200).json(
      new apiResponse(200, user, "Successfully retrieved user profile")
    );
  } catch (err) {
    console.error("Error while getting user profile");
    throw new apiError(500, "Couldn't retrieve user profile")
  }
})
