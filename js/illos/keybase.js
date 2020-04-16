const startOffset = window.pageYOffset;
const gridXCount = 4;
const gridYCount = 2;
const letterPixelXCount = 14;
const letterPixelYCount = 20;
const pixelModMin = 0.02;
const pixelModMax = 0.67;

//prettier-ignore
const emptyRow = [pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin, pixelModMin]

const text = "keybase";
const textArr = text.split("");

const palette = {
  neutral: "#F6F2E9",
  yellow: "#E8DD10",
  cyan: "#229FDD",
  magenta: "#F70B92",
};

// prettier-ignore
const geo = {
  "1": [emptyRow,[pixelModMin,pixelModMin,pixelModMin,.260450161,.556270096,.556270096,.556270096,.556270096,.556270096,.189710611,pixelModMin,pixelModMin,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,pixelModMin,.260450161,.556270096,.556270096,.556270096,.556270096,.556270096,.189710611,pixelModMin,pixelModMin,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,pixelModMin,.260450161,.556270096,.556270096,.556270096,.556270096,.556270096,.189710611,pixelModMin,pixelModMin,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,pixelModMin,.260450161,.556270096,.556270096,.556270096,.556270096,.556270096,.189710611,pixelModMin,pixelModMin,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin,.260450161,.556270096,.556270096,.556270096,.189710611,pixelModMin,pixelModMin,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin,.260450161,.556270096,.556270096,.556270096,.189710611,pixelModMin,pixelModMin,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin,.260450161,.556270096,.556270096,.556270096,.189710611,pixelModMin,pixelModMin,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin,.260450161,.556270096,.556270096,.556270096,.189710611,pixelModMin,pixelModMin,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin,.260450161,.556270096,.556270096,.556270096,.189710611,pixelModMin,pixelModMin,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin,.260450161,.556270096,.556270096,.556270096,.189710611,pixelModMin,pixelModMin,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin,.260450161,.556270096,.556270096,.556270096,.189710611,pixelModMin,pixelModMin,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin,.260450161,.556270096,.556270096,.556270096,.189710611,pixelModMin,pixelModMin,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin,.260450161,.556270096,.556270096,.556270096,.189710611,pixelModMin,pixelModMin,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin,.260450161,.556270096,.556270096,.556270096,.189710611,pixelModMin,pixelModMin,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin,.260450161,.556270096,.556270096,.556270096,.189710611,pixelModMin,pixelModMin,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin,.260450161,.556270096,.556270096,.556270096,.189710611,pixelModMin,pixelModMin,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin,.260450161,.556270096,.556270096,.556270096,.189710611,pixelModMin,pixelModMin,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin,.260450161,.556270096,.556270096,.556270096,.189710611,pixelModMin,pixelModMin,pixelModMin,pixelModMin],emptyRow],
  "0": [emptyRow,[pixelModMin,pixelModMin,pixelModMin,pixelModMin,.067335344,.213228589,.314231606,.314231606,.213228589,.112225573,pixelModMin,pixelModMin,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,pixelModMin,.059584765,.46359683,pixelModMax,pixelModMax,pixelModMax,pixelModMax,pixelModMax,.236340043,.044434313,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,.059584765,pixelModMax,pixelModMax,pixelModMax,pixelModMax,pixelModMax,pixelModMax,pixelModMax,pixelModMax,.142526478,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,.277828435,pixelModMax,pixelModMax,pixelModMax,.30314933,.166795258,pixelModMax,pixelModMax,pixelModMax,.454513572,pixelModMin,pixelModMin],[pixelModMin,.067335344,.480465736,.55565687,.55565687,.332327979,pixelModMin,pixelModMin,.503787613,.539559515,.539559515,.387248369,.02637301,pixelModMin],[pixelModMin,.134355054,.55565687,.55565687,.55565687,.190783475,pixelModMin,pixelModMin,.234972294,.539559515,.539559515,.539559515,.059584765,pixelModMin],[pixelModMin,.190783475,.613775471,.613775471,.613775471,.190783475,pixelModMin,pixelModMin,.059584765,.539559515,.539559515,.539559515,.234972294,pixelModMin],[pixelModMin,.12267658,.55565687,.55565687,.55565687,.259100793,pixelModMin,pixelModMin,.029283861,.539559515,.539559515,.539559515,.234972294,pixelModMin],[pixelModMin,.12267658,.55565687,.55565687,.55565687,.259100793,pixelModMin,pixelModMin,.029283861,.539559515,.539559515,.539559515,.234972294,pixelModMin],[pixelModMin,.12267658,.55565687,.55565687,.55565687,.259100793,pixelModMin,pixelModMin,.029283861,.539559515,.539559515,.539559515,.234972294,pixelModMin],[pixelModMin,.12267658,.55565687,.55565687,.55565687,.259100793,pixelModMin,pixelModMin,.029283861,.539559515,.539559515,.539559515,.234972294,pixelModMin],[pixelModMin,.12267658,.55565687,.55565687,.55565687,.259100793,pixelModMin,pixelModMin,.029283861,.539559515,.539559515,.539559515,.234972294,pixelModMin],[pixelModMin,.12267658,.55565687,.55565687,.55565687,.259100793,pixelModMin,pixelModMin,.059584765,.539559515,.539559515,.539559515,.234972294,pixelModMin],[pixelModMin,.040401206,.55565687,pixelModMax,pixelModMax,.619375,pixelModMin,.059584765,.234972294,.539559515,.539559515,.539559515,.059584765,pixelModMin],[pixelModMin,.040401206,.268990671,pixelModMax,pixelModMax,.529564424,.205758575,.1112436,.503787613,.529564424,.529564424,.387248369,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,.101003016,.488987866,pixelModMax,pixelModMax,.529564424,pixelModMax,pixelModMax,.529564424,.529564424,.101003016,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,pixelModMin,.130181665,.47078628,.47078628,.47078628,.47078628,.47078628,pixelModMax,.192221365,pixelModMin,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin,.1112436,.205758575,.1112436,pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin],emptyRow],
  "k": [emptyRow,[pixelModMin,.260450161,.556270096,.556270096,.556270096,.189710611,pixelModMin,pixelModMin,pixelModMin,.260450161,.556270096,.556270096,.556270096,0.189710611],[pixelModMin,.260450161,.556270096,.556270096,.556270096,.189710611,pixelModMin,pixelModMin,pixelModMin,.260450161,.556270096,.556270096,.556270096,0.189710611],[pixelModMin,.260450161,.556270096,.556270096,.556270096,.189710611,pixelModMin,pixelModMin,pixelModMin,.260450161,.556270096,.556270096,.556270096,0.189710611],[pixelModMin,.260450161,.556270096,.556270096,.556270096,.189710611,pixelModMin,pixelModMin,pixelModMin,.260450161,.556270096,.556270096,.189710611,pixelModMin],[pixelModMin,.260450161,.556270096,.556270096,.556270096,.189710611,pixelModMin,pixelModMin,.260450161,.556270096,.556270096,.556270096,.189710611,pixelModMin],[pixelModMin,.260450161,.556270096,.556270096,.556270096,.189710611,pixelModMin,.260450161,.556270096,.556270096,.556270096,.189710611,pixelModMin,pixelModMin,],[pixelModMin,.260450161,.556270096,.556270096,.556270096,.189710611,.260450161,.556270096,.556270096,.556270096,.189710611,pixelModMin,pixelModMin,pixelModMin],[pixelModMin,.260450161,.556270096,.556270096,.556270096,.189710611,.260450161,.556270096,.556270096,.189710611,pixelModMin,pixelModMin,pixelModMin,pixelModMin],[pixelModMin,.260450161,.556270096,.556270096,.556270096,.556270096,.556270096,.556270096,.411575563,pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin],[pixelModMin,.260450161,.556270096,.556270096,.556270096,.556270096,.556270096,.556270096,.556270096,.556270096,pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin],[pixelModMin,.260450161,.556270096,.556270096,.556270096,.189710611,.556270096,.556270096,.556270096,.556270096,.189710611,pixelModMin,pixelModMin,pixelModMin],[pixelModMin,.260450161,.556270096,.556270096,.556270096,.189710611,pixelModMin,.556270096,.556270096,.556270096,.189710611,pixelModMin,pixelModMin,pixelModMin],[pixelModMin,.260450161,.556270096,.556270096,.556270096,.189710611,pixelModMin,.260450161,.556270096,.556270096,.556270096,.189710611,pixelModMin,pixelModMin],[pixelModMin,.260450161,.556270096,.556270096,.556270096,.189710611,pixelModMin,pixelModMin,.260450161,.556270096,.556270096,.556270096,.189710611,pixelModMin],[pixelModMin,.260450161,.556270096,.556270096,.556270096,.189710611,pixelModMin,pixelModMin,pixelModMin,.260450161,.556270096,.556270096,.189710611,pixelModMin],[pixelModMin,.260450161,.556270096,.556270096,.556270096,.189710611,pixelModMin,pixelModMin,pixelModMin,.260450161,.556270096,.556270096,.556270096,0.189710611],[pixelModMin,.260450161,.556270096,.556270096,.556270096,.189710611,pixelModMin,pixelModMin,pixelModMin,.260450161,.556270096,.556270096,.556270096,0.189710611],[pixelModMin,.260450161,.556270096,.556270096,.556270096,.189710611,pixelModMin,pixelModMin,pixelModMin,.260450161,.556270096,.556270096,.556270096,0.189710611],emptyRow],
  "e": [emptyRow,emptyRow,[pixelModMin,.260450161,.311897106,.311897106,.311897106,.311897106,.311897106,.311897106,.311897106,.311897106,.311897106,.311897106,.260450161,pixelModMin],[pixelModMin,.260450161,.556270096,.556270096,.556270096,.556270096,.556270096,.556270096,.556270096,.556270096,.556270096,.556270096,.260450161,pixelModMin],[pixelModMin,.260450161,.556270096,.556270096,.556270096,.556270096,.556270096,.556270096,.556270096,.556270096,.556270096,.556270096,.260450161,pixelModMin],[pixelModMin,.260450161,.556270096,.556270096,.556270096,.556270096,.556270096,.556270096,.556270096,.556270096,.556270096,.556270096,.260450161,pixelModMin],[pixelModMin,.260450161,.556270096,.556270096,.556270096,.260450161,pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin],[pixelModMin,.260450161,.556270096,.556270096,.556270096,.260450161,pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin],[pixelModMin,.260450161,.556270096,.556270096,.556270096,.260450161,pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin],[pixelModMin,.260450161,.556270096,.556270096,.556270096,.556270096,.556270096,.556270096,.556270096,.556270096,.556270096,.260450161,pixelModMin,pixelModMin],[pixelModMin,.260450161,.556270096,.556270096,.556270096,.556270096,.556270096,.556270096,.556270096,.556270096,.556270096,.260450161,pixelModMin,pixelModMin],[pixelModMin,.260450161,.556270096,.556270096,.556270096,.556270096,.556270096,.556270096,.556270096,.556270096,.556270096,.260450161,pixelModMin,pixelModMin],[pixelModMin,.260450161,.556270096,.556270096,.556270096,.260450161,pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin],[pixelModMin,.260450161,.556270096,.556270096,.556270096,.260450161,pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin],[pixelModMin,.260450161,.556270096,.556270096,.556270096,.260450161,pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin],[pixelModMin,.260450161,.556270096,.556270096,.556270096,.556270096,.556270096,.556270096,.556270096,.556270096,.556270096,.556270096,.260450161,pixelModMin],[pixelModMin,.260450161,.556270096,.556270096,.556270096,.556270096,.556270096,.556270096,.556270096,.556270096,.556270096,.556270096,.260450161,pixelModMin],[pixelModMin,.260450161,.556270096,.556270096,.556270096,.556270096,.556270096,.556270096,.556270096,.556270096,.556270096,.556270096,.260450161,pixelModMin],[pixelModMin,.260450161,.389067524,.389067524,.389067524,.389067524,.389067524,.389067524,.389067524,.389067524,.389067524,.389067524,.260450161,pixelModMin],emptyRow],
  "y": [emptyRow,[pixelModMin,.077441077,.131313131,.131313131,.077441077,pixelModMin,pixelModMin,pixelModMin,pixelModMin,.077441077,.131313131,.131313131,.077441077,pixelModMin],[pixelModMin,.259259259,.555555556,.555555556,.555555556,.148148148,pixelModMin,pixelModMin,.148148148,.555555556,.555555556,.555555556,.259259259,pixelModMin],[pixelModMin,.259259259,.555555556,.555555556,.555555556,.148148148,pixelModMin,pixelModMin,.148148148,.555555556,.555555556,.555555556,.259259259,pixelModMin],[pixelModMin,.259259259,.555555556,.555555556,.555555556,.148148148,pixelModMin,pixelModMin,.148148148,.555555556,.555555556,.555555556,.259259259,pixelModMin],[pixelModMin,.121212121,.555555556,.555555556,.555555556,.259259259,pixelModMin,pixelModMin,.259259259,.555555556,.555555556,.555555556,.121212121,pixelModMin],[pixelModMin,.121212121,.555555556,.555555556,.555555556,.259259259,pixelModMin,pixelModMin,.259259259,.555555556,.555555556,.555555556,.121212121,pixelModMin],[pixelModMin,.04040404,.555555556,.555555556,.555555556,.35016835,pixelModMin,pixelModMin,.35016835,.555555556,.555555556,.555555556,.04040404,pixelModMin],[pixelModMin,.04040404,.269360269,pixelModMax,pixelModMax,.528619529,.205387205,.205387205,.528619529,pixelModMax,pixelModMax,.269360269,.04040404,pixelModMin],[pixelModMin,pixelModMin,.101010101,.488215488,pixelModMax,.488215488,.488215488,.488215488,.488215488,pixelModMax,.488215488,.101010101,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,pixelModMin,.060606061,.464646465,.565656566,.565656566,.565656566,.565656566,.464646465,.060606061,pixelModMin,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,pixelModMin,.067340067,.212121212,.582491582,.582491582,.521885522,.181818182,.067340067,.067340067,pixelModMin,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,pixelModMin,.067340067,.212121212,.582491582,.582491582,.521885522,.067340067,pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,pixelModMin,.067340067,.212121212,.582491582,.582491582,.521885522,.067340067,pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,pixelModMin,.067340067,.212121212,.582491582,.582491582,.521885522,.067340067,pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,pixelModMin,.067340067,.212121212,.582491582,.582491582,.521885522,.067340067,pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,pixelModMin,.067340067,.212121212,.582491582,.582491582,.521885522,.067340067,pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,pixelModMin,.067340067,.212121212,.582491582,.582491582,.521885522,.067340067,pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,pixelModMin,.067340067,.212121212,.582491582,.582491582,.521885522,.067340067,pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin],emptyRow],
  "b": [emptyRow,[pixelModMin,pixelModMin,pixelModMin,.044585987,.210191083,.210191083,.210191083,.210191083,.210191083,.210191083,.210191083,pixelModMin,pixelModMin,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,.257961783,.554140127,.554140127,.554140127,.554140127,.554140127,.554140127,.554140127,.554140127,.23566879,.044585987,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,.257961783,.554140127,.554140127,.554140127,.554140127,.554140127,.554140127,.554140127,.554140127,.554140127,.23566879,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,.257961783,.554140127,.554140127,.554140127,.420382166,.315286624,.420382166,.554140127,.554140127,.554140127,.452229299,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,.257961783,.554140127,.554140127,.554140127,.267515924,.073248408,.073248408,.423566879,.538216561,.538216561,.385350318,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,.257961783,.554140127,.554140127,.554140127,.191082803,pixelModMin,pixelModMin,.130573248,.538216561,.538216561,.538216561,.060509554,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,.257961783,.554140127,.554140127,.554140127,.267515924,.073248408,.073248408,.423566879,.538216561,.538216561,.385350318,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,.257961783,.554140127,.554140127,.554140127,.420382166,.315286624,.420382166,.554140127,.554140127,.554140127,.452229299,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,.257961783,.554140127,.554140127,.554140127,.554140127,.554140127,.554140127,.554140127,.554140127,.554140127,.23566879,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,.257961783,.554140127,.554140127,.554140127,.554140127,.554140127,.554140127,.554140127,.554140127,.23566879,pixelModMin,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,.257961783,.554140127,.554140127,.554140127,.554140127,.554140127,.554140127,.554140127,.554140127,.554140127,.23566879,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,.257961783,.554140127,.554140127,.554140127,.420382166,.315286624,.420382166,.554140127,.554140127,.554140127,.452229299,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,.257961783,.554140127,.554140127,.554140127,.267515924,.073248408,.073248408,.423566879,.538216561,.538216561,.385350318,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,.257961783,.554140127,.554140127,.554140127,.191082803,pixelModMin,pixelModMin,.130573248,.538216561,.538216561,.538216561,.060509554,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,.257961783,.554140127,.554140127,.554140127,.267515924,.073248408,.073248408,.423566879,.538216561,.538216561,.385350318,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,.257961783,.554140127,.554140127,.554140127,.420382166,.315286624,.420382166,.554140127,.554140127,.554140127,.452229299,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,.257961783,.554140127,.554140127,.554140127,.554140127,.554140127,.554140127,.554140127,.554140127,.554140127,.23566879,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,.257961783,.554140127,.554140127,.554140127,.554140127,.554140127,.554140127,.554140127,.554140127,.23566879,.044585987,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,pixelModMin,.044585987,.210191083,.210191083,.210191083,.210191083,.210191083,.210191083,.210191083,pixelModMin,pixelModMin,pixelModMin,pixelModMin],emptyRow,],
  "a": [emptyRow,[pixelModMin,pixelModMin,pixelModMin,.257961783,.554140127,.554140127,.554140127,.554140127,.554140127,.554140127,.257961783,pixelModMin,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,.191082803,.554140127,.554140127,.554140127,.554140127,.554140127,.554140127,.554140127,.554140127,.191082803,pixelModMin,pixelModMin],[pixelModMin,.257961783,.554140127,.554140127,.554140127,.420382166,.315286624,.315286624,.420382166,.554140127,.554140127,.554140127,.257961783,pixelModMin],[pixelModMin,.257961783,.554140127,.554140127,.554140127,.257961783,.073248408,.073248408,.257961783,.554140127,.554140127,.554140127,.257961783,pixelModMin],[pixelModMin,.257961783,.554140127,.554140127,.554140127,.257961783,pixelModMin,pixelModMin,.257961783,.554140127,.554140127,.554140127,.257961783,pixelModMin],[pixelModMin,.257961783,.554140127,.554140127,.554140127,.257961783,pixelModMin,pixelModMin,.257961783,.554140127,.554140127,.554140127,.257961783,pixelModMin],[pixelModMin,.257961783,.554140127,.554140127,.554140127,.257961783,pixelModMin,pixelModMin,.257961783,.554140127,.554140127,.554140127,.257961783,pixelModMin],[pixelModMin,.257961783,.554140127,.554140127,.554140127,.257961783,.073248408,.073248408,.257961783,.554140127,.554140127,.554140127,.257961783,pixelModMin],[pixelModMin,.257961783,.554140127,.554140127,.554140127,.563694268,.563694268,.563694268,.563694268,.554140127,.554140127,.554140127,.257961783,pixelModMin],[pixelModMin,.257961783,.554140127,.554140127,.554140127,.563694268,.563694268,.563694268,.563694268,.554140127,.554140127,.554140127,.257961783,pixelModMin],[pixelModMin,.257961783,.554140127,.554140127,.554140127,.563694268,.563694268,.563694268,.563694268,.554140127,.554140127,.554140127,.257961783,pixelModMin],[pixelModMin,.257961783,.554140127,.554140127,.554140127,.420382166,.315286624,.315286624,.420382166,.554140127,.554140127,.554140127,.257961783,pixelModMin],[pixelModMin,.257961783,.554140127,.554140127,.554140127,.257961783,pixelModMin,pixelModMin,.257961783,.554140127,.554140127,.554140127,.257961783,pixelModMin],[pixelModMin,.257961783,.554140127,.554140127,.554140127,.257961783,pixelModMin,pixelModMin,.257961783,.554140127,.554140127,.554140127,.257961783,pixelModMin],[pixelModMin,.257961783,.554140127,.554140127,.554140127,.257961783,pixelModMin,pixelModMin,.257961783,.554140127,.554140127,.554140127,.257961783,pixelModMin],[pixelModMin,.257961783,.554140127,.554140127,.554140127,.257961783,pixelModMin,pixelModMin,.257961783,.554140127,.554140127,.554140127,.257961783,pixelModMin],[pixelModMin,.257961783,.554140127,.554140127,.554140127,.257961783,pixelModMin,pixelModMin,.257961783,.554140127,.554140127,.554140127,.257961783,pixelModMin],[pixelModMin,.257961783,.554140127,.554140127,.554140127,.257961783,pixelModMin,pixelModMin,.257961783,.554140127,.554140127,.554140127,.257961783,pixelModMin],[pixelModMin,pixelModMin,.207006369,.207006369,.207006369,pixelModMin,pixelModMin,pixelModMin,pixelModMin,.207006369,.207006369,.207006369,pixelModMin,pixelModMin],emptyRow],
  "s": [emptyRow,[pixelModMin,pixelModMin,pixelModMin,pixelModMin,.066878981,.210191083,.312101911,.312101911,.210191083,.066878981,pixelModMin,pixelModMin,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,pixelModMin,.060509554,.458598726,.557324841,.557324841,.557324841,pixelModMax,.458598726,.060509554,pixelModMin,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,.098726115,.484076433,.557324841,.557324841,.557324841,.557324841,pixelModMax,.557324841,.484076433,.098726115,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,.267515924,pixelModMax,pixelModMax,.525477707,.203821656,.203821656,.525477707,pixelModMax,pixelModMax,.2267515924,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,.550955414,.550955414,.550955414,.347133758,pixelModMin,pixelModMin,.347133758,.550955414,.550955414,.550955414,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,.347133758,.550955414,.550955414,.550955414,pixelModMin,pixelModMin,.347133758,.550955414,.550955414,.550955414,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,.257961783,.550955414,.550955414,.550955414,.085987261,pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,.085987261,.257961783,.550955414,.550955414,.550955414,.550955414,pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,pixelModMin,pixelModMin,.257961783,.550955414,.550955414,.550955414,.550955414,.085987261,pixelModMin,pixelModMin,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin,.257961783,.550955414,.550955414,.550955414,.550955414,.085987261,pixelModMin,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin,.085987261,.550955414,.550955414,.550955414,.550955414,.257961783,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin,.257961783,.550955414,.550955414,.550955414,.085987261,pixelModMin],[pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin,pixelModMin,.257961783,.550955414,.550955414,.550955414,.257961783,pixelModMin],[pixelModMin,.133757962,.550955414,.550955414,.550955414,.187898089,pixelModMin,pixelModMin,.187898089,.550955414,.550955414,.550955414,.133757962,pixelModMin],[pixelModMin,.066878981,.477707006,.550955414,.550955414,.328025478,pixelModMin,pixelModMin,.328025478,.550955414,.550955414,.550955414,.066878981,pixelModMin],[pixelModMin,pixelModMin,.27388535,.550955414,.550955414,.550955414,.299363057,.299363057,.550955414,.550955414,.550955414,.27388535,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,.060509554,.550955414,.550955414,pixelModMax,pixelModMax,pixelModMax,pixelModMax,.550955414,.550955414,.060509554,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,pixelModMin,.060509554,.458598726,.550955414,pixelModMax,pixelModMax,.550955414,.458598726,.060509554,pixelModMin,pixelModMin,pixelModMin],[pixelModMin,pixelModMin,pixelModMin,pixelModMin,.066878981,.210191083,.312101911,.312101911,.210191083,.066878981,pixelModMin,pixelModMin,pixelModMin,pixelModMin],emptyRow],
  " ": [emptyRow,emptyRow,emptyRow,emptyRow,emptyRow,emptyRow,emptyRow,emptyRow,emptyRow,emptyRow,emptyRow,emptyRow,emptyRow,emptyRow,emptyRow,emptyRow,emptyRow,emptyRow,emptyRow,emptyRow,]
};

let animating = false;
let frameId = null;
let lastOffset = null;

class Pixel {
  constructor({ x, y, ySize, xSize, area, context }) {
    Object.assign(this, { x, y, ySize, xSize, area, context });
  }
  draw() {
    const { x, y, xSize, ySize, area, context } = this;
    const computedPxHeight = ySize * area;
    const computedPxWidth = xSize * area;
    context.fillRect(x, y - computedPxHeight / 2, computedPxWidth, computedPxHeight);
  }
}

class Grid {
  constructor({ x, y, xCount, yCount, width, color, stateGeo, context }) {
    Object.assign(this, {
      x,
      y,
      xCount,
      yCount,
      width,
      color,
      stateGeo,
      context,
    });
    this.pixels = [];
    this.createPixels();
  }
  updatePixels(stateGeo) {
    const { xCount } = this;
    let row = 0;
    this.pixels.forEach((px, index) => {
      px.ySize = geo[stateGeo][row][index % xCount];
      if (index > 0 && index % xCount === 0) row++;
    });
    this.stateGeo = stateGeo;
  }
  createPixels() {
    const { x, y, xCount, yCount, width, stateGeo = "0", context } = this;
    const pxWidth = width / xCount;
    for (let yCoord = 0; yCoord < yCount; yCoord++) {
      for (let xCoord = 0; xCoord < xCount; xCoord++) {
        this.pixels.push(
          new Pixel({
            x: x + xCoord * pxWidth,
            y: y + yCoord * pxWidth,
            ySize: geo[stateGeo][yCoord][xCoord],
            xSize: 0.95,
            area: pxWidth,
            context,
          })
        );
      }
    }
  }
}

class App {
  constructor() {
    this.canvas = document.querySelector("canvas");
    this.context = this.canvas.getContext("2d");
    this.rect = this.canvas.getBoundingClientRect();

    this.text = "keybase";

    this.window = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    this.canvas.style.height = "25vh";
    this.canvas.style.margin = "auto";

    this.canvas.width = this.window.width;
    if (this.window.width < 700) {
      this.canvas.height = this.window.height * 0.1;
    } else if (this.window.width < 900) {
      this.canvas.height = this.window.height * 0.2;
    } else if (this.window.width < 1200) {
      this.canvas.height = this.window.height * 0.3;
    } else {
      this.canvas.height = this.window.height * 0.5;
    }

    this.gridXCount = 7;
    this.gridYCount = 1;

    this.frame = 0;
    this.start = null;

    this.grids = [];
    this.canvases = {};
    this.contexts = {};

    Object.values(palette).forEach((color) => {
      let precanvas = document.createElement('canvas');
      precanvas.width = this.window.width;
      precanvas.height = this.window.height;
      this.canvases[color] = precanvas;
      let precontext = precanvas.getContext("2d");
      precontext.fillStyle = color;
      this.contexts[color] = precontext;

    });

    const gridWidth = this.window.width / 7;
    const gridHeight = gridWidth * 1.4; // this is a magic number
    const geoKeys = Object.keys(geo);
    for (let gridY = 0; gridY < this.gridYCount; gridY++) {
      const gridPositionY = this.canvas.height / 2 - gridHeight / 2 + gridHeight * gridY;
      for (let gridX = 0; gridX < this.gridXCount; gridX++) {
        this.grids.push(
          new Grid({
            x: gridX * gridWidth,
            y: gridPositionY,
            xCount: letterPixelXCount,
            yCount: letterPixelYCount,
            width: gridWidth,
            color: palette.cyan,
            stateGeo: geoKeys[Math.floor(Math.random() * geoKeys.length)],
            context: this.contexts[palette.cyan],
          }),
          new Grid({
            x: gridX * gridWidth + 2,
            y: gridPositionY - 2,
            xCount: letterPixelXCount,
            yCount: letterPixelYCount,
            width: gridWidth,
            color: palette.magenta,
            stateGeo: geoKeys[Math.floor(Math.random() * geoKeys.length)],
            context: this.contexts[palette.magenta],
          }),
          new Grid({
            x: gridX * gridWidth - 1,
            y: gridPositionY + 4,
            xCount: letterPixelXCount,
            yCount: letterPixelYCount,
            width: gridWidth,
            color: palette.yellow,
            stateGeo: geoKeys[Math.floor(Math.random() * geoKeys.length)],
            context: this.contexts[palette.yellow],
          })
        );
      }
    }
    this.cells = [];
    let cellIndex = 0;
    while (this.grids.length > 0) {
      this.cells.push({
        targetLetter: this.text[cellIndex],
        active: true,
        grids: this.grids.splice(0, 3),
      });
      cellIndex++;
    }
  }
  clearCanvas() {
    this.context.clearRect(0, 0, this.window.width, this.window.height);
    Object.values(this.contexts).forEach((context) => {
      context.clearRect(0, 0, this.window.width, this.window.height);
    });
    this.context.fillStyle = palette.neutral;
    this.context.fillRect(0, 0, this.window.width, this.window.height);
  }
  draw() {
    frameId = requestAnimationFrame(this.draw.bind(this));

    if (!animating) {
      if (window.pageYOffset !== lastOffset) {
        animating = true;
        for (let cell of this.cells) {
          cell.active = true;
          for (let grid of cell.grids) {
            grid.stateGeo = Object.keys(geo)[Math.floor(Math.random() * Object.keys(geo).length)];
          }
        }
      } else {
        return;
      }
    }

    if (window.pageYOffset > startOffset + this.rect.bottom + 300) {
      return;
    }

    this.context.globalCompositeOperation = "multiply";

    // px.draw();
    if (this.frame === 0) {
      this.clearCanvas();
      this.cells.forEach((cell, cellIndex) => {
        cell.grids.forEach((grid, gridIndex) => {
          if (gridIndex < cell.grids.length - 1 && grid.stateGeo != cell.targetLetter) {
            grid.updatePixels(
              Object.keys(geo)[Math.floor(Math.random() * Object.keys(geo).length)]
            );
          }
          if (
            cell.grids.slice(0, 2).every((grid, index) => {
              return grid.stateGeo == cell.targetLetter;
            })
          ) {
            cell.active = false;
          }

          grid.pixels.forEach((pixel) => {
            pixel.draw();
          });
        });
      });
      Object.values(this.canvases).forEach((canvas) => {
          this.context.drawImage(canvas, 0, 0, this.window.width, this.window.height);
      });
    }

    this.frame++;

    if (this.frame >= 6) {
      this.frame = 0;
    }

    if (this.cells.every((cell) => !cell.active)) {
      animating = false;
    }

    lastOffset = window.pageYOffset;
  }
}

const app = new App();

document.addEventListener("DOMContentLoaded", () => {
  animating = true;
  app.canvas.classList.remove("home__illo--hidden");
  requestAnimationFrame(app.draw.bind(app));
});
