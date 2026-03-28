Add-Type -AssemblyName System.Drawing

$inputPath = "C:\Users\HP\.gemini\antigravity\brain\3455de9c-c3ba-4573-9995-a4476251ebbf\media__1774558552800.jpg"
$outputPath = "c:\Users\HP\Desktop\Sarikin Mota\sarikin mota\public\logo-gold.png"

Write-Host "Loading image..."
$bitmap = New-Object System.Drawing.Bitmap($inputPath)

$width = $bitmap.Width
$height = $bitmap.Height

# We will create a new bitmap for the output with transparency
$outBitmap = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

# Background color estimate (sampling top left)
$bg = $bitmap.GetPixel(10, 10)
$bgR = $bg.R
$bgG = $bg.G
$bgB = $bg.B

Write-Host "Detected BG Color: $bgR, $bgG, $bgB"

$minX = $width
$minY = $height
$maxX = 0
$maxY = 0

for ($y = 0; $y -lt $height; $y++) {
    for ($x = 0; $x -lt $width; $x++) {
        $pixel = $bitmap.GetPixel($x, $y)
        $r = $pixel.R
        $g = $pixel.G
        $b = $pixel.B
        
        # Calculate distance to background
        $diffR = [Math]::Abs($r - $bgR)
        $diffG = [Math]::Abs($g - $bgG)
        $diffB = [Math]::Abs($b - $bgB)
        $dist = [Math]::Max($diffR, [Math]::Max($diffG, $diffB))
        
        # White Text Mask
        $isWhite = ($r -gt 220) -and ($g -gt 220) -and ($b -gt 220)
        
        # Gold Mask
        $isGold = ($r -gt 120) -and ($g -gt 100) -and ($b -lt 160) -and (($r - $b) -gt 30)
        
        # Foreground Mask (not background)
        $isFg = $dist -gt 30
        
        if ($isWhite -or $isGold -or $isFg) {
            # It's part of the logo. Keep the original color but make it fully opaque
            $outBitmap.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $r, $g, $b))
            
            # Track bounding box
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        } else {
            # Make it transparent
            $outBitmap.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        }
    }
}

if ($maxX -gt 0) {
    # Crop to bounding box
    $cropWidth = $maxX - $minX + 1
    $cropHeight = $maxY - $minY + 1
    $cropRect = New-Object System.Drawing.Rectangle($minX, $minY, $cropWidth, $cropHeight)
    $cropped = $outBitmap.Clone($cropRect, $outBitmap.PixelFormat)
    
    $cropped.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
    Write-Host "Successfully extracted logo to $outputPath"
} else {
    Write-Host "Failed to find logo pixels."
}

$bitmap.Dispose()
$outBitmap.Dispose()
if ($cropped) { $cropped.Dispose() }
