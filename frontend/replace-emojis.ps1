# Emoji to Heroicons replacement script
$replacements = @{
    '🏠' = '<HomeIcon style={{ width: "20px", height: "20px", strokeWidth: 2 }} />'
    '🔑' = '<KeyIcon style={{ width: "20px", height: "20px", strokeWidth: 2 }} />'
    '📝' = '<PencilSquareIcon style={{ width: "20px", height: "20px", strokeWidth: 2 }} />'
    '📖' = '<BookOpenIcon style={{ width: "20px", height: "20px", strokeWidth: 2 }} />'
    '💬' = '<ChatBubbleLeftRightIcon style={{ width: "20px", height: "20px", strokeWidth: 2 }} />'
    '🩺' = '<UserGroupIcon style={{ width: "20px", height: "20px", strokeWidth: 2 }} />'
    '👤' = '<UserIcon style={{ width: "20px", height: "20px", strokeWidth: 2 }} />'
    '😊' = '<FaceSmileIcon style={{ width: "20px", height: "20px", strokeWidth: 2 }} />'
    '📊' = '<ChartBarIcon style={{ width: "20px", height: "20px", strokeWidth: 2 }} />'
    '❤️' = '<HeartIcon style={{ width: "20px", height: "20px", strokeWidth: 2 }} />'
    '🚪' = '<ArrowRightOnRectangleIcon style={{ width: "20px", height: "20px", strokeWidth: 2 }} />'
    '⭐' = '<StarIcon style={{ width: "20px", height: "20px", fill: "currentColor" }} />'
    '💡' = '<InformationCircleIcon style={{ width: "20px", height: "20px", strokeWidth: 2 }} />'
    '📱' = '<DevicePhoneMobileIcon style={{ width: "20px", height: "20px", strokeWidth: 2 }} />'
    '🔍' = '<MagnifyingGlassIcon style={{ width: "20px", height: "20px", strokeWidth: 2 }} />'
}

Get-ChildItem -Path src -Include *.jsx,*.js -Recurse | ForEach-Object {
    $content = Get-Content $_.FullName -Raw -Encoding UTF8
    $modified = $false
    
    foreach ($emoji in $replacements.Keys) {
        if ($content -match [regex]::Escape($emoji)) {
            $content = $content -replace [regex]::Escape($emoji), $replacements[$emoji]
            $modified = $true
        }
    }
    
    if ($modified) {
        Set-Content -Path $_.FullName -Value $content -Encoding UTF8 -NoNewline
        Write-Host "Updated: $($_.FullName)"
    }
}
