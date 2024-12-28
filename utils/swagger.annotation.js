const swaggerDefinitions = {
  "/user/signup": {
    post: {
      tags: ["Auth"],
      summary: "Create a new user",
      description: `|
          This endpoint allows you to create a new user account.
          To create a user, you must provide the following information: |
          
          - email: The email address of the user. This field is required.
          - password: The password for the user account. This field is required.
          - name: The name for the user account. This field is required.
          
          Upon successful creation, the endpoint returns a response with status code 201 (Created).`,
      requestBody: {
        description: "User object",
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                name: { type: "string" },
                email: { type: "string" },
                password: { type: "string" },
                phoneNumber: { type: "string" },
              },
              required: ["name", "email", "password"],
            },
          },
        },
      },
      responses: {
        201: {
          description: "User created successfully",
        },
      },
    },
  },

  "/user/login": {
    post: {
      tags: ["Auth"],
      summary: "Login user",
      description: `| 
            This endpoint allows users to log in to their accounts.
            To authenticate, users must provide their email and password. |

            - email: The email address of the user. This field is required.
            - password: The password for the user account. This field is required.

            Upon successful authentication, the endpoint returns a response with status code 200 (OK) along with an authentication token.

            Note: The authentication token should be included in the headers of subsequent requests to authenticate the user.

              `,
      requestBody: {
        description: "User object",
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                email: { type: "string" },
                password: { type: "string" },
              },
              required: ["email", "password"],
            },
          },
        },
      },
      responses: {
        201: {
          description: "User Login successfully",
        },
      },
    },
  },

  "/user/request-otp": {
    post: {
      tags: ["Auth"],
      summary: "Request OTP",
      description: `| 
            This endpoint allows users to request a one-time password (OTP) for authentication purposes.
            Users must provide their email address to receive the OTP.
            Upon successful request, the OTP is sent to the provided email address. |
            
            - email: The email address of the user. This field is required.

            Note: The OTP expires after a certain period and can only be used once for authentication.
          `,
      requestBody: {
        description: "OTP object",
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                email: { type: "string" },
              },
              required: ["email"],
            },
          },
        },
      },
      responses: {
        200: {
          description: "OTP sent successfully",
        },
      },
    },
  },

  "/user/confirm-otp": {
    post: {
      tags: ["Auth"],
      summary: "Confirm OTP",
      description: `|
            This endpoint allows users to confirm the one-time password (OTP) they received for authentication purposes.
            Users must provide the OTP they received via email. |
    
            Upon successful confirmation, the user's authentication is validated and they can proceed with their desired action.
    
            Note: The OTP expires after a certain period and can only be used once for authentication.
          `,
      requestBody: {
        description: "OTP object",
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                OTP: { type: "string" },
                email: { type: "string" },
              },
              required: ["email", "OTP"],
            },
          },
        },
      },
      responses: {
        200: {
          description: "OTP confirmed successfully",
        },
      },
    },
  },

  "/user/request-password-reset": {
    patch: {
      tags: ["Auth"],
      summary: "Request password reset",
      description: `|
            This endpoint allows users to request a password reset by providing their email address.
            Upon successful request, a password reset OTP will be sent to the provided email address. |

            Note: The password reset OTP is valid for a limited time period and can only be used once.
          `,
      requestBody: {
        description: "Password object",
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                email: { type: "string" },
              },
              required: ["email"],
            },
          },
        },
      },
      responses: {
        200: {
          description: "password reset pin sent",
        },
      },
    },
  },

  "/user/confirm-password-reset": {
    post: {
      tags: ["Auth"],
      summary: "Confirm request password",
      description: `| 
            This endpoint allows users to confirm a password reset request by providing a new password and a code received via email.
            Upon successful confirmation, the user's password will be updated to the new password. |
    
            Note: The password reset code expires after a certain period and can only be used once.
          `,
      requestBody: {
        description: "Password object",
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                code: { type: Number },
                email: { type: "string" },
                userId: { type: "string" },
              },
              required: ["userId", "code", "password"],
            },
          },
        },
      },
      responses: {
        200: {
          description: "Your password has been reset successfully",
        },
      },
    },
  },

  "/navigation/map?lat={lat}&lon={lon}": {
    post: {
      tags: ["GPS"],
      summary: "Get User Current Map",
      description: `| 
            This endpoint allows users to view and get their current map.
            To get current map, users must provide their longitude and latitude. |

            - longitude: The current longitude of the user. This field is required.
            - latitude: The current latitude of the user. This field is required.

            For testing purpose, use this longitute:=3.3792 latitude:=6.5244

            Upon successful authentication, the endpoint returns a response with status code 200 (OK) along with locations object.


              `,
      requestBody: {
        description: "Navigation object",
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                lon: { type: Number },
                lat: { type: Number },
              },
              required: ["lon", "lat"],
            },
          },
        },
      },
      responses: {
        201: {
          description: "Current map fetch successfully",
        },
      },
    },
  },

  "/navigation/route?start={start}&end={end}": {
    post: {
      tags: ["GPS"],
      summary: "Get User Current Route",
      description: `| 
            This endpoint allows users to view and get their current route.
            To get current route, users must provide their start and end. |

            - start: The latitude and longitude the user start from. This field is required.
            - end: The latitude and longitude the user is going to. This field is required.

            For testing purpose, use this start:=3.3792,6.5244 end:=4.5426,8.4966

            Upon successful authentication, the endpoint returns a response with status code 200 (OK) along with locations object.


              `,
      requestBody: {
        description: "Navigation object",
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                start: { type: "string" },
                end: { type: "string" },
              },
              required: ["start", "end"],
            },
          },
        },
      },
      responses: {
        201: {
          description: "Current get successfully",
        },
      },
    },
  },


};

