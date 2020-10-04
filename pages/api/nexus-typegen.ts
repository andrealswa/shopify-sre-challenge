/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */







declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  ImageInput: { // input type
    path: string; // String!
  }
}

export interface NexusGenEnums {
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
}

export interface NexusGenRootTypes {
  Image: { // root type
    id: number; // Int!
    privateImg: boolean; // Boolean!
    url: string; // String!
    userId: number; // Int!
  }
  Mutation: {};
  Query: {};
  Token: { // root type
    token: string; // String!
  }
  User: { // root type
    email: string; // String!
    id: number; // Int!
  }
}

export interface NexusGenAllTypes extends NexusGenRootTypes {
  ImageInput: NexusGenInputs['ImageInput'];
  String: NexusGenScalars['String'];
  Int: NexusGenScalars['Int'];
  Float: NexusGenScalars['Float'];
  Boolean: NexusGenScalars['Boolean'];
  ID: NexusGenScalars['ID'];
}

export interface NexusGenFieldTypes {
  Image: { // field return type
    id: number; // Int!
    privateImg: boolean; // Boolean!
    url: string; // String!
    userId: number; // Int!
  }
  Mutation: { // field return type
    deletePhoto: string; // String!
    loginUser: NexusGenRootTypes['Token']; // Token!
    photoVisibility: string; // String!
    signupUser: NexusGenRootTypes['Token']; // Token!
    uploadImage: NexusGenRootTypes['Image']; // Image!
  }
  Query: { // field return type
    getAllUserImages: string; // String!
    getUser: NexusGenRootTypes['User']; // User!
  }
  Token: { // field return type
    token: string; // String!
  }
  User: { // field return type
    email: string; // String!
    id: number; // Int!
    images: NexusGenRootTypes['Image'][]; // [Image!]!
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    deletePhoto: { // args
      imgUrl?: string | null; // String
      token?: string | null; // String
    }
    loginUser: { // args
      email: string; // String!
      password: string; // String!
    }
    photoVisibility: { // args
      imgUrl?: string | null; // String
      token?: string | null; // String
    }
    signupUser: { // args
      email: string; // String!
      password: string; // String!
    }
    uploadImage: { // args
      input: NexusGenInputs['ImageInput']; // ImageInput!
      token: string; // String!
    }
  }
  Query: {
    getAllUserImages: { // args
      token?: string | null; // String
    }
    getUser: { // args
      token?: string | null; // String
    }
  }
}

export interface NexusGenAbstractResolveReturnTypes {
}

export interface NexusGenInheritedFields {}

export type NexusGenObjectNames = "Image" | "Mutation" | "Query" | "Token" | "User";

export type NexusGenInputNames = "ImageInput";

export type NexusGenEnumNames = never;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = "Boolean" | "Float" | "ID" | "Int" | "String";

export type NexusGenUnionNames = never;

export interface NexusGenTypes {
  context: any;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  allTypes: NexusGenAllTypes;
  inheritedFields: NexusGenInheritedFields;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractResolveReturn: NexusGenAbstractResolveReturnTypes;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
}