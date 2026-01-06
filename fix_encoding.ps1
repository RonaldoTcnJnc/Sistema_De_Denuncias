$paths = @(
    "c:\Users\USER\Documents\SistemaDeDenuncias\SD\database\init.sql",
    "c:\Users\USER\Documents\SistemaDeDenuncias\SD\database\README.md"
)

foreach ($path in $paths) {
    if (Test-Path $path) {
        Write-Host "Fixing $path..."
        $txt = [System.IO.File]::ReadAllText($path)
        
        # Common Mojibake fixer
        $txt = $txt.Replace('Ã¡', 'á')
        $txt = $txt.Replace('Ã©', 'é')
        $txt = $txt.Replace('Ã­', 'í') # Copy-pasted from output, corresponds to Ã + SHY usually
        $txt = $txt.Replace("Ã$([char]0x00AD)", 'í') # Handle Soft Hyphen explicitly just in case
        $txt = $txt.Replace('Ã³', 'ó')
        $txt = $txt.Replace('Ãº', 'ú')
        $txt = $txt.Replace('Ã±', 'ñ')
        $txt = $txt.Replace('Ã‘', 'Ñ')
        $txt = $txt.Replace('Ã“', 'Ó')
        $txt = $txt.Replace('Ã‰', 'É')
        $txt = $txt.Replace('Ã ', 'à')
        $txt = $txt.Replace('Â¿', '¿')
        $txt = $txt.Replace('Â¡', '¡')
        
        [System.IO.File]::WriteAllText($path, $txt)
    }
}
Write-Host "Done."
