import type { Scalars, Maybe, InputMaybe } from './Shared'
import type {
  ReturnAppSettings,
  ReturnAppSettingsInput,
} from './ReturnAppSettings'

export { Scalars, Maybe, InputMaybe }

export interface SellerSetting extends ReturnAppSettings {
  __typename?: 'SellerSetting'
  id?: Maybe<Scalars['String']>
}

export type SellerSettingResponseList = {
  __typename?: 'SellerSettingResponseList'
  sellers?: Maybe<Array<Maybe<SellerSetting>>>
}

export interface SellerSettingInput extends ReturnAppSettingsInput {
  id?: InputMaybe<Scalars['String']>
  sellerId?: Scalars['String']
}

export type QueryReturnSellerSettingsArgs = {
  sellerId: Scalars['String']
}

export type MutationUpdateSellerSettingArgs = {
  id: Scalars['ID']
  settings: SellerSettingInput
}

export type MutationSaveSellerSettingArgs = {
  settings: SellerSettingInput
}
