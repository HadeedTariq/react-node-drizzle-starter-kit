type User = {
  id: string;
  user_name?: string;
  email: string;
  role: string;
  gender: "male" | "female" | "other";
  country_code: string;
};

type ErrResponse = {
  response: {
    data: {
      message: string;
      otpType?: string;
      code?: string;
    };
  };
};
