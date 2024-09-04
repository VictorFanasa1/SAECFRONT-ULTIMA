export interface admUserInv {
    uiUser: number;
    sUser: string;
    sPassword: string;
    uiClaveUbicacion: string;
    bActive: boolean;
    dtCreated: Date;
}

export class admUserInv {

}

// [uiUser] [int] IDENTITY(1,1) NOT NULL,
// [sUser] [nvarchar](50) NOT NULL,
// [sPassword] [nvarchar](50) NOT NULL,
// [uiClaveUbicacion] [nvarchar](20) NULL,
// [bActive] [bit] NOT NULL,
// [dtCreated] [datetime] NOT NULL,