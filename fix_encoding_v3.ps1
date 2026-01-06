$files = @(
    "c:\Users\USER\Documents\SistemaDeDenuncias\SD\database\init.sql",
    "c:\Users\USER\Documents\SistemaDeDenuncias\SD\database\README.md"
)

$C3 = [char]0xC3

foreach ($path in $files) {
    if (Test-Path $path) {
        Write-Host "Processing $path"
        $content = [System.IO.File]::ReadAllText($path)

        # á -> Ã¡ (C3 A1)
        $content = $content.Replace("$C3$([char]0xA1)", "á")
        
        # é -> Ã© (C3 A9)
        $content = $content.Replace("$C3$([char]0xA9)", "é")
        
        # í -> Ã (C3 AD)
        $content = $content.Replace("$C3$([char]0xAD)", "í")
        
        # ó -> Ã³ (C3 B3)
        $content = $content.Replace("$C3$([char]0xB3)", "ó")
        
        # ú -> Ãº (C3 BA)
        $content = $content.Replace("$C3$([char]0xBA)", "ú")
        
        # ñ -> Ã± (C3 B1)
        $content = $content.Replace("$C3$([char]0xB1)", "ñ")
        
        # Ñ -> Ã‘ (C3 91) - Windows-1252 0x91 is Left Single Quote
        # If the file is interpreted as Latin1, 0x91 maps to control char, but in Windows-1252 it's ‘
        # Let's try explicit char
        $content = $content.Replace("$C3$([char]0x91)", "Ñ")

        [System.IO.File]::WriteAllText($path, $content)
    }
}
Write-Host "Encoding fixed."
