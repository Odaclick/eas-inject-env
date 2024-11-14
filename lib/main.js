"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
async function run() {
    try {
        const envKeys = Object.keys(process.env).filter(key => key.startsWith('INPUT_ENVKEY_'));
        const envVars = {};
        for (const key of envKeys) {
            const envKey = key.split('INPUT_ENVKEY_')[1];
            const envValue = process.env[key] ?? '';
            if (envValue === '' && core.getInput('fail_on_empty') === 'true') {
                throw new Error(`La clave de entorno ${envKey} está vacía.`);
            }
            envVars[envKey] = envValue;
        }
        const directory = core.getInput('directory') ?? '';
        const easJsonPath = path.join(process.env.GITHUB_WORKSPACE ?? '.', directory, 'eas.json');
        const easJson = JSON.parse(fs.readFileSync(easJsonPath, 'utf8'));
        if (easJson == null) {
            throw new Error("No se pudo encontrar el archivo 'eas.json'");
        }
        const profileName = core.getInput('profile_name');
        if (easJson.build?.[profileName] == null) {
            throw new Error(`Perfil '${profileName}' no encontrado  en eas.json.`);
        }
        easJson.build[profileName].env = {
            ...(easJson.build[profileName].env ?? {}),
            ...envVars
        };
        if (core.getInput('sort_keys') === 'true') {
            easJson.build[profileName].env = Object.keys(easJson.build[profileName].env)
                .sort()
                .reduce((acc, key) => {
                acc[key] = easJson.build[profileName].env[key];
                return acc;
            }, {});
        }
        fs.writeFileSync(easJsonPath, JSON.stringify(easJson, null, 2));
        core.info(`Variables de entorno inyectadas correctamente en el perfil '${profileName}' en ${easJsonPath}`);
        const updatedEasJson = fs.readFileSync(easJsonPath, 'utf8');
        core.info(`Updated eas.json content:\n${updatedEasJson}`);
    }
    catch (error) {
        if (error instanceof Error)
            core.setFailed(error.message);
    }
}
void run();
