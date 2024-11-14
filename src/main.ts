import * as core from '@actions/core'
import * as fs from 'fs'
import * as path from 'path'

async function run(): Promise<void> {
  try {
    const envKeys = Object.keys(process.env).filter(key =>
      key.startsWith('INPUT_ENVKEY_')
    )
    const envVars: {[key: string]: string} = {}

    for (const key of envKeys) {
      const envKey = key.split('INPUT_ENVKEY_')[1]
      const envValue = process.env[key] || ''

      if (envValue === '' && core.getInput('fail_on_empty') === 'true') {
        throw new Error(`La clave de entorno ${envKey} está vacía.`)
      }

      envVars[envKey] = envValue
    }

    const directory = core.getInput('directory') || ''
    const easJsonPath = path.join(
      process.env['GITHUB_WORKSPACE'] || '.',
      directory,
      'eas.json'
    )
    const easJson = JSON.parse(fs.readFileSync(easJsonPath, 'utf8'))
    const operationType = core.getInput('operation_type') || 'build'

    if (!['build', 'update'].includes(operationType)) {
      throw new Error("El tipo de operación debe ser 'build' o 'update'.")
    }

    const profileName = core.getInput('profile_name')
    if (!easJson[operationType] || !easJson[operationType][profileName]) {
      throw new Error(
        `Perfil '${profileName}' no encontrado en el entorno de operación '${operationType}' en eas.json.`
      )
    }

    easJson[operationType][profileName].env = {
      ...(easJson[operationType][profileName].env || {}),
      ...envVars
    }

    if (core.getInput('sort_keys') === 'true') {
      easJson[operationType][profileName].env = Object.keys(
        easJson[operationType][profileName].env
      )
        .sort()
        .reduce(
          (acc, key) => {
            acc[key] = easJson[operationType][profileName].env[key]
            return acc
          },
          {} as {[key: string]: string}
        )
    }

    fs.writeFileSync(easJsonPath, JSON.stringify(easJson, null, 2))
    core.info(
      `Variables de entorno inyectadas correctamente en el perfil '${profileName}' en el entorno '${operationType}' en ${easJsonPath}`
    )
    const updatedEasJson = fs.readFileSync(easJsonPath, 'utf8')
    core.info(`Updated eas.json content:\n${updatedEasJson}`)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

void run()
