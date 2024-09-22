import {
  deleteUserFromDB,
  getUserInfo,
  invalidateRefreshToken,
  login,
  refreshToken,
  register,
  updatePassword,
} from '../db/crudOperation/user.crud.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const options = {
  httpOnly: true,
  secure: true,
};
/*
 * User Registration
 * POST /api/v1/users/register: Create a new user.
 */
export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if ([username, email, password].some((field) => !field?.trim())) {
    throw new apiError(400, 'All fields are required');
  }

  try {
    const id = await register(username, email, password);
    res
      .status(201)
      .json(new apiResponse(201, { userId: id }, 'User Created Successfully'));
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
    throw new apiError(400, 'Either one of username or email is required');
  }

  if (!password) {
    throw new apiError(401, 'Password is required');
  }

  const identifier = username || email;
  try {
    const { accessToken, refreshToken } = await login(identifier, password);
    return res
      .status(200)
      .cookie('accessToken', accessToken, options)
      .cookie('refreshToken', refreshToken, options)
      .json(
        new apiResponse(
          200,
          { accessToken, refreshToken },
          'User logged in successfuly'
        )
      );
  } catch (err) {
    console.error('Error while logging in user');
    throw new apiError(500, "Couldn't login User");
  }
});

/*
 * User Logout
 * POST /api/v1/users/logout: Invalidate the user's token.
 */

export const logoutUser = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    throw new apiError(401, 'No refreshToken found');
  }

  try {
    const result = await invalidateRefreshToken(refreshToken);
    return res
      .status(200)
      .clearCookie('accessToken', options)
      .clearCookie('refreshToken', options)
      .json(new apiResponse(200, { result: result }, 'User logged out'));
  } catch (err) {
    console.error('Error while logging out user');
    throw new apiError(500, "Couldn't log out user");
  }
});

/* Get User Profile
 *GET /api/v1/users/profile: Retrieve the logged-in user's profile information.
 */

export const getUserProfile = asyncHandler(async (req, res) => {
  const { username, email } = req.body;
  if (!username || !email) {
    throw new apiError(
      401,
      'Either one of the username or the enail is needed'
    );
  }

  const identifier = username || email;
  try {
    const user = await getUserInfo(identifier);
    return res
      .status(200)
      .json(new apiResponse(200, user, 'Successfully retrieved user profile'));
  } catch (err) {
    console.error('Error while getting user profile');
    throw new apiError(500, "Couldn't retrieve user profile");
  }
});

/*
 *Delete User
 * DELETE /api/v1/users/profile: Remove the user account.
 */

export const deleteUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email) {
    throw new apiError(401, 'Either one of username or email is needed');
  }

  const identifier = username || email;
  try {
    await deleteUserFromDB(identifier, password);
    return res
      .status(200)
      .clearCookie('refreshToken', refreshToken, options)
      .clearCookie('accessToken', accessToken, options)
      .json(new apiResponse(200, 'User deleted successfully'));
  } catch (err) {
    console.error('Error while deleting user');
    throw new apiError(500, "Couldn't Delete user");
  }
});

/*
 * Password Reset
 * POST /api/v1/users/reset-password: Initiate a password reset process.
 */

export const changePassword = asyncHandler(async (req, res) => {
  const { username, email, oldPassword, newPassword } = req.body;
  if (!username || !email) {
    throw new apiError(401, 'Either one of username or email is needed');
  }

  if (oldPassword === newPassword) {
    throw new apiError(412, 'Old password and new password cannot be same');
  }

  const identifier = username || email;
  try {
    await updatePassword(identifier, oldPassword, newPassword);
    res
      .status(200)
      .json(new apiResponse(200, 'Updated the password successfully'));
  } catch (err) {
    console.error('Error while updating password');
    throw new apiError(500, "Couldn't Update user password");
  }
});

/*
* Update User Profile
* PUT /api/v1/users/profile: Update user details like email, username, etc.
*/