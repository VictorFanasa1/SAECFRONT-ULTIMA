export interface admRegistrarDispositivos {
    uiRecord: number;
    uiUsuario: number;
    sSerie: string;
    sSerial: string;
    sPlaca: string;
    sTipo: string;
    sMarca: string;
    sModelo: string;
    dtRegistro: Date;
    bRevisado: boolean;
    uiNumeroEmpleado: number;
}

export class admRegistrarDispositivos {

}

	// [uiRecord] [int] IDENTITY(1,1) NOT NULL,
	// [uiUsuario] [int] NOT NULL,
	// [sSerie] [nvarchar](50) NOT NULL,
	// [sSerial] [nvarchar](50) NULL,
	// [sPlaca] [nvarchar](50) NOT NULL,
	// [sTipo] [nvarchar](50) NOT NULL,
	// [sMarca] [nvarchar](50) NOT NULL,
	// [sModelo] [nvarchar](50) NOT NULL,
	// [dtRegistro] [datetime] NOT NULL,
	// [bRevisado] [bit] NOT NULL,