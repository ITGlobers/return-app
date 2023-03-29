import type {
  CustomReturnReason,
  ReturnOption,
  PaymentOptionsInput,
  CustomReturnReasonInput,
  ReturnOptionInput
} from './ReturnAppSettings'

export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export interface SellerSetting {
  sellerId: string;
  parentAccount?: string;
  maxDays?: number;
  excludedCategories?: unknown[];
  paymentOptions?: {
    enablePaymentMethodSelection?: boolean;
    allowedPaymentTypes?: {
      bank?: boolean;
      card?: boolean;
      giftCard?: boolean;
      [k: string]: unknown;
    };
    automaticallyRefundPaymentMethod?: boolean;
    [k: string]: unknown;
  };
  termsUrl?: string;
  customReturnReasons?: unknown[];
  options?: {
    enableOtherOptionSelection?: boolean;
    enablePickupPoints?: boolean;
    enableProportionalShippingValue?: boolean;
    enableSelectItemCondition?: boolean;
    [k: string]: unknown;
  };
  [k: string]: unknown;
}


export type SellerSettingResponseList = {
  __typename?: 'SellerSettingResponseList';
  sellers?: Maybe<Array<Maybe<SellerSetting>>>;
};

export type SellerSettingInput = {
  id?: InputMaybe<Scalars['String']>;
  sellerId: Scalars['String'];
  parentAccount?: InputMaybe<Scalars['String']>;
  maxDays: Scalars['Int'];
  excludedCategories: Array<Scalars['String']>;
  paymentOptions: PaymentOptionsInput;
  termsUrl: Scalars['String'];
  customReturnReasons?: InputMaybe<Array<CustomReturnReasonInput>>;
  options?: InputMaybe<ReturnOptionInput>;
};

export type QueryReturnSellerSettingsArgs = {
  sellerId: Scalars['String'];
};

export type MutationUpdateSellerSettingArgs = {
  id: Scalars['ID'];
  settings: SellerSettingInput;
};

export type MutationSaveSellerSettingArgs = {
  settings: SellerSettingInput;
};