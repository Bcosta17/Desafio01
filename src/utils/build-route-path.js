export function buildRoutePath(path) {
    const routeParametersRegex = /:([a-zA-Z]+)/g // g defini a regex como global e procura todo caminho
    const pathWithParams = path.replaceAll(routeParametersRegex,'(?<$1>[a-z0-9\-_]+)') // $1 pega a 1ª posição do retorno da regex e adiciona como nome do grupo 
    
    const pathRegex = new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`)
    
    return pathRegex
}