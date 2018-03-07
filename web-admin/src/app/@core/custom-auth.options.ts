export interface CustomAuthModuleConfig {
  alwaysFail?: boolean;
  rememberMe?: boolean;
  endpoint?: string;
  method?: string;
  redirect?: {
    success?: string | null;
    failure?: string | null;
  };
  defaultErrors?: string[];
  defaultMessages?: string[];
}

export interface CustomResetAuthModuleConfig extends CustomAuthModuleConfig {
  resetPasswordTokenKey?: string;
}

export interface CustomAuthProviderConfig {
  baseEndpoint?: string;
  login?: boolean | CustomAuthModuleConfig;
  register?: boolean | CustomAuthModuleConfig;
  requestPass?: boolean | CustomAuthModuleConfig;
  resetPass?: boolean | CustomResetAuthModuleConfig;
  logout?: boolean | CustomResetAuthModuleConfig;
  token?: {
    key?: string;
    getter?: Function;
  };
  errors?: {
    key?: string;
    getter?: Function;
  };
  messages?: {
    key?: string;
    getter?: Function;
  };
  validation?: {
    password?: {
      required?: boolean;
      minLength?: number | null;
      maxLength?: number | null;
      regexp?: string | null;
    };
    email?: {
      required?: boolean;
      regexp?: string | null;
    };
    fullName?: {
      required?: boolean;
      minLength?: number | null;
      maxLength?: number | null;
      regexp?: string | null;
    };
  };
}
