const { writeFile } = require('fs');
const { argv } = require('yargs');
// read environment variables from .env file
require('dotenv').config();
// read the command line arguments passed with yargs
const environment = argv.environment;
const isProduction = environment === 'prod';
const targetPath = isProduction
   ? `./src/environments/environment.prod.ts`
   : `./src/environments/environment.ts`;
// we have access to our environment variables
// in the process.env object thanks to dotenv
const environmentFileContent = `
export const environment = {
   production: ${isProduction},
   APIPATH_GENERAL:"${process.env.APIPATH_GENERAL}",
   APIPATH_INMUEBLE:"${process.env.APIPATH_INMUEBLE}",
   APIPATH_INMUEBLEDETALLE:"${process.env.APIPATH_INMUEBLEDETALLE}",
   APIPATH_CLIENTE:"${process.env.APIPATH_CLIENTE}",
   APIPATH_CLIENTEDETALLE:"${process.env.APIPATH_CLIENTEDETALLE}",
   APIPATH_CLIENTEXINMUEBLE:"${process.env.APIPATH_CLIENTEXINMUEBLE}",
   APIPATH_CONTRATO:"${process.env.APIPATH_CONTRATO}",
   APIPATH_CONTRATODETALLE:"${process.env.APIPATH_CONTRATODETALLE}",
   APIPATH_INGRESOGASTOGENERAL:"${process.env.APIPATH_INGRESOGASTOGENERAL}",
   APIPATH_FACTURASANIO:"${process.env.APIPATH_FACTURASANIO}",
   APIPATH_INGRESOGASTOGENERALDETALLE:"${process.env.APIPATH_INGRESOGASTOGENERALDETALLE}",
   APIPATH_INGRESOGASTOESPECIFICO:"${process.env.APIPATH_INGRESOGASTOESPECIFICO}",
   APIPATH_INGRESOGASTOESPECIFICODETALLE:"${process.env.APIPATH_INGRESOGASTOESPECIFICODETALLE}",
   APIPATH_AVISOSFACTURAS:"${process.env.APIPATH_AVISOSFACTURAS}",
   APIPATH_INTERVINIENTE:"${process.env.APIPATH_INTERVINIENTE}",
   APIPATH_INTERVINIENTEDETALLE:"${process.env.APIPATH_INTERVINIENTEDETALLE}",
   APIPATH_PERSONASPAGADORA:"${process.env.APIPATH_PERSONASPAGADORA}",
   APIPATH_USUARIO:"${process.env.APIPATH_USUARIO}",
   APIPATH_USUARIODETALLE:"${process.env.APIPATH_USUARIODETALLE}",
   APIPATH_LOGGIN:"${process.env.APIPATH_LOGGIN}",
   APIPATH_TIPOS:"${process.env.APIPATH_TIPOS}",
   APIPATH_TIPOINMUEBLE:"${process.env.APIPATH_TIPOINMUEBLE}",
   APIPATH_TIPOINMUEBLEDETALLE:"${process.env.APIPATH_TIPOINMUEBLEDETALLE}",
   APIPATH_TIPOCONTRATO:"${process.env.APIPATH_TIPOCONTRATO}",
   APIPATH_TIPOCONTRATODETALLE:"${process.env.APIPATH_TIPOCONTRATODETALLE}",
   APIPATH_TIPOCONCEPTO:"${process.env.APIPATH_TIPOCONCEPTO}",
   APIPATH_TIPOCONCEPTODETALLE:"${process.env.APIPATH_TIPOCONCEPTODETALLE}",
   APIPATH_TIPOINTERVINIENTE:"${process.env.APIPATH_TIPOINTERVINIENTE}",
   APIPATH_TIPOINTERVINIENTEDETALLE:"${process.env.APIPATH_TIPOINTERVINIENTEDETALLE}",
   APIPATH_TIPOPAGO:"${process.env.APIPATH_TIPOPAGO}",
   APIPATH_TIPOPAGODETALLE:"${process.env.APIPATH_TIPOPAGODETALLE}",
   APIPATH_TIPOROL:"${process.env.APIPATH_TIPOROL}",
   APIPATH_TIPOROLDETALLE:"${process.env.APIPATH_TIPOROLDETALLE}",
   APIPATH_TIPOPERIODO:"${process.env.APIPATH_TIPOPERIODO}",
   APIPATH_TIPOPERIODODETALLE:"${process.env.APIPATH_TIPOPERIODODETALLE}",
   APIPATH_TIPOCATEGORIA:"${process.env.APIPATH_TIPOCATEGORIA}",
   APIPATH_TIPOCATEGORIADETALLE:"${process.env.APIPATH_TIPOCATEGORIADETALLE}"
};
`;
// write the content to the respective file
writeFile(targetPath, environmentFileContent, function (err) {
   if (err) {
      console.log(err);
   }
   console.log(`Wrote variables to ${targetPath}`);
});