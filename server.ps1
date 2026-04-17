# Servidor HTTP simple para PowerShell
$port = 8080
$ip = "localhost"
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://$ip`:$port/")
$listener.Start()

Write-Host "Servidor iniciado en http://localhost:8080"
Write-Host "Presiona Ctrl+C para detener el servidor"
Write-Host ""
Write-Host "Abre tu navegador y ve a: http://localhost:8080/Contacto/Contacto.html"
Write-Host ""

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        $localPath = $request.Url.LocalPath
        if ($localPath -eq "/") { $localPath = "/index.html" }
        
        $filePath = Join-Path $PSScriptRoot $localPath.Substring(1)
        
        if (Test-Path $filePath -PathType Leaf) {
            $content = [IO.File]::ReadAllBytes($filePath)
            
            # Determinar el tipo de contenido
            $extension = [IO.Path]::GetExtension($filePath).ToLower()
            $contentType = switch ($extension) {
                ".html" { "text/html; charset=utf-8" }
                ".css" { "text/css; charset=utf-8" }
                ".js" { "application/javascript; charset=utf-8" }
                ".json" { "application/json; charset=utf-8" }
                ".png" { "image/png" }
                ".jpg" { "image/jpeg" }
                ".jpeg" { "image/jpeg" }
                ".gif" { "image/gif" }
                ".svg" { "image/svg+xml" }
                default { "application/octet-stream" }
            }
            
            $response.ContentType = $contentType
            $response.ContentLength64 = $content.Length
            $response.OutputStream.Write($content, 0, $content.Length)
        } else {
            $response.StatusCode = 404
            $response.ContentType = "text/html"
            $content = [Text.Encoding]::UTF8.GetBytes("<h1>404 - Archivo no encontrado</h1><p>$localPath</p>")
            $response.ContentLength64 = $content.Length
            $response.OutputStream.Write($content, 0, $content.Length)
        }
        
        $response.Close()
    }
} finally {
    $listener.Stop()
    Write-Host "Servidor detenido"
}
