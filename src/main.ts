import * as core from '@actions/core'
import * as fs from 'fs'
import * as path from 'path'

async function run(): Promise<void> {
  try {
    const envKeys = Object.keys(process.env).filter(key =>
      key.startsWith('INPUT_ENVKEY_')
    )
    const envVars: Record<string, string> = {}

    for (const key of envKeys) {
      const envKey = key.split('INPUT_ENVKEY_')[1]
      const envValue = process.env[key] ?? ''

      if (envValue === '' && core.getInput('fail_on_empty') === 'true') {
        throw new Error(`La clave de entorno ${envKey} está vacía.`)
      }

      envVars[envKey] = envValue
    }

    const directory = core.getInput('directory') ?? ''
    const easJsonPath = path.join(
      process.env.GITHUB_WORKSPACE ?? '.',
      directory,
      'eas.json'
    )
    const easJson = JSON.parse(fs.readFileSync(easJsonPath, 'utf8'))

    if (easJson == null) {
      throw new Error("No se pudo encontrar el archivo 'eas.json'")
    }

    const profileName = core.getInput('profile_name')
    if (easJson.build?.[profileName] == null) {
      throw new Error(`Perfil '${profileName}' no encontrado  en eas.json.`)
    }

    easJson.build[profileName].env = {
      ...(easJson.build[profileName].env ?? {}),
      ...envVars
    }

    if (core.getInput('sort_keys') === 'true') {
      easJson.build[profileName].env = Object.keys(
        easJson.build[profileName].env as Record<string, string | number>
      )
        .sort()
        .reduce<Record<string, string>>((acc, key) => {
          acc[key] = easJson.build[profileName].env[key]
          return acc
        }, {})
    }

    fs.writeFileSync(easJsonPath, JSON.stringify(easJson, null, 2))
    core.info(
      `Variables de entorno inyectadas correctamente en el perfil '${profileName}' en ${easJsonPath}`
    )
    const updatedEasJson = fs.readFileSync(easJsonPath, 'utf8')
    core.info(`Updated eas.json content:\n${updatedEasJson}`)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

void run()
