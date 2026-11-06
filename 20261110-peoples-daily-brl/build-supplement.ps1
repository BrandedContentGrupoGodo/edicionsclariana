$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem
$utf8 = [Text.UTF8Encoding]::new($false)
$docs = @()
foreach ($n in '01','02','03','04') {
  $stream = [IO.File]::Open("C:/Users/enric/Dropbox/08 PEOPLE'S DAILY/2026 11 10 People's Daily/$n.docx", 'Open', 'Read', 'ReadWrite')
  $zip = [IO.Compression.ZipArchive]::new($stream, 'Read')
  $reader = [IO.StreamReader]::new($zip.GetEntry('word/document.xml').Open())
  [xml]$xml = $reader.ReadToEnd()
  $ns = [Xml.XmlNamespaceManager]::new($xml.NameTable)
  $ns.AddNamespace('w','http://schemas.openxmlformats.org/wordprocessingml/2006/main')
  $paras = @($xml.SelectNodes('//w:body/w:p',$ns) | ForEach-Object { ($_.SelectNodes('.//w:t',$ns) | ForEach-Object { $_.InnerText }) -join '' } | Where-Object { $_.Trim() })
  $docs += ,$paras
  $reader.Dispose(); $zip.Dispose(); $stream.Dispose()
}
function E($s) { $s.Replace('&', '&amp;').Replace('<', '&lt;').Replace('>', '&gt;').Replace('"', '&quot;').Replace("'", '&#39;') }
$labels = @('Manufactura avanzada','Industria e innovación','Transición ecológica','Conservación de pandas')
$files = @('index.html','02.html','03.html','04.html')
$urls = @('https://www.lavanguardia.com/economia/20261110/11677677/uno-cada-tres-automoviles-vendidos-mundo-es-chino-brl.html','https://www.lavanguardia.com/economia/20261110/11677678/innovacion-hace-prosperar-industria-manufacturera-brl.html','https://www.lavanguardia.com/economia/20261110/11677681/dioxido-carbono-proporcionar-calefaccion-brl.html','https://www.lavanguardia.com/economia/20261110/11677683/conservacion-pandas-fortalece-vinculos-globales-brl.html')
$titles = @($docs[0][0],$docs[1][0],$docs[2][0],$docs[3][0])
for ($i=0; $i -lt 4; $i++) {
  $p = $docs[$i]
  $metaIndex = if ($i -eq 1) { 1 } else { 2 }
  $sourceDate = [regex]::Match($p[$metaIndex], '\d{1,2}/\d{1,2}/\d{4}').Value
  $date = '10/11/2026'
  $parts = $date.Split('/')
  $isoDate = '{0}-{1:D2}-{2:D2}' -f [int]$parts[2],[int]$parts[1],[int]$parts[0]
  $author = $p[$metaIndex].Replace($sourceDate,'').Trim()
  $subtitle = if ($i -eq 1) { '' } else { $p[1] }
  $captionCount = @(3,3,2,4)[$i]
  $end = $p.Count
  $captionStart=$end-$captionCount; $bodyEnd=$captionStart
  $headings = @(@(7,10,14),@(9,12,15),@(6,8,12,17),@(6,13,19))[$i]
  $caps = @($p[$captionStart..($end-1)])
  if ($i -eq 2) { $caps += 'Pie de foto provisional'; $captionCount = 3 }
  $nav = ''; $cards=''
  for ($j=0;$j -lt 4;$j++) {
    $current = if ($j -eq $i) {' aria-current="page"'} else {''}
    $nav += "<a href='$($urls[$j])'$current>$(E $labels[$j])</a>"
    if ($j -ne $i) { $cards += "<a class='pd-story-card' href='$($urls[$j])'><img src='https://brandedcontentgrupogodo.github.io/edicionsclariana/20261110-peoples-daily-brl/assets/img/tema$($j+1)-1.jpg' alt='' loading='lazy'><span class='pd-story-shade'></span><span class='pd-story-content'><small>$(E $labels[$j])</small><strong>$(E $titles[$j])</strong><span aria-hidden='true'>→</span></span></a>" }
  }
  $body=''; $photo=1
  $bodyLength=$bodyEnd-$metaIndex-1
  $positions=@{}
  for ($f=2;$f -le $captionCount;$f++) { $positions[[int][math]::Floor(($f-1)*$bodyLength/$captionCount)]=$f }
  for ($k=$metaIndex+1;$k -lt $bodyEnd;$k++) {
    $text=$p[$k]
    if ($i -eq 0 -and $text.EndsWith('avanzan con')) { $text += ' rapidez.' }
    if ($headings -contains $k) { $body+="<h2 class='pd-reveal'>$(E $text)</h2>" } else { $body+="<p class='pd-reveal'>$(E $text)</p>" }
    $relative=$k-$metaIndex
    if ($positions.ContainsKey($relative)) { $f=$positions[$relative]; $body+="<figure class='pd-photo pd-reveal'><img src='https://brandedcontentgrupogodo.github.io/edicionsclariana/20261110-peoples-daily-brl/assets/img/tema$($i+1)-$f.jpg' alt='$(E $caps[$f-1])' loading='lazy' decoding='async'><figcaption>$(E $caps[$f-1])</figcaption></figure>" }
  }
  $html=@"
<!doctype html>
<html lang="es">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>$(E $titles[$i]) | People's Daily | La Vanguardia</title><meta name="description" content="$(E $subtitle)"><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet"><link rel="stylesheet" href="https://brandedcontentgrupogodo.github.io/edicionsclariana/20261110-peoples-daily-brl/assets/css/main.css"><script src="https://brandedcontentgrupogodo.github.io/edicionsclariana/20261110-peoples-daily-brl/assets/js/main.js" defer></script></head>
<body class="pd-page"><div class="pd-supplement">
<a class="pd-skip" href="#pd-reading">Ir al contenido</a>
<header class="pd-top"><div class="pd-top-inner"><a class="pd-brand" href="https://www.lavanguardia.com/economia/20261110/11677677/uno-cada-tres-automoviles-vendidos-mundo-es-chino-brl.html">Ofrecido por <strong>PEOPLE'S DAILY</strong></a><nav class="pd-nav" aria-label="Temas del suplemento">$nav</nav></div><div class="pd-progress" aria-hidden="true"></div></header>
<section class="pd-hero" aria-labelledby="pd-title"><img class="pd-hero-image" src="https://brandedcontentgrupogodo.github.io/edicionsclariana/20261110-peoples-daily-brl/assets/img/tema$($i+1)-1.jpg" alt="$(E $caps[0])" fetchpriority="high"><div class="pd-hero-shade"></div><div class="pd-hero-content"><span class="pd-eyebrow">$(E $labels[$i])</span><h1 id="pd-title">$(E $titles[$i])</h1><p class="pd-subtitle">$(E $subtitle)</p></div></section>
<p class="pd-cover-caption">$(E $caps[0])</p>
<main class="pd-layout" id="pd-reading"><article class="pd-article"><div class="pd-meta"><span>$(E $author)</span><time datetime="$isoDate">$date</time></div>$body</article><aside class="pd-sidebar" aria-label="Más temas"><div class="pd-sidebar-inner"><span class="pd-sidebar-title">En este suplemento</span>$cards</div></aside></main>
<footer class="pd-credits"><h2>Créditos</h2><p>Producción: Edicions Clariana SL | Redacción: People's Daily Digital | Diseño: Martí Palma | Maquetación: Enric Abad | Fotografías: People's Daily Digital</p><p>Un proyecto de Brandslab · Godó Nexus</p><a href="#pd-title">Volver arriba ↑</a></footer>
</div></body></html>
"@
  [IO.File]::WriteAllText((Join-Path $PSScriptRoot $files[$i]),$html,$utf8)
}

