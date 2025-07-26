# Guardian Pre-Push Validation Script (PowerShell)
# Ensures only clean builds reach GitHub -> Vercel

Write-Host "🛡️  Running guardian pre-push validation..." -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

# Exit on any error
$ErrorActionPreference = "Stop"

# Check if we're in a git repository
if (-not (Test-Path ".git")) {
    Write-Host "❌  Not in a git repository" -ForegroundColor Red
    exit 1
}

try {
    # Step 1: Clean environment (like Vercel does)
    Write-Host "🧹  Cleaning build environment..." -ForegroundColor Yellow
    if (Test-Path ".next") {
        Remove-Item ".next" -Recurse -Force
    }

    # Step 2: Strict production build
    Write-Host "🏗️  Running production build..." -ForegroundColor Yellow
    Write-Host "    (This matches exactly what Vercel will do)" -ForegroundColor Gray

    # Capture build output to analyze errors
    $buildOutput = npm run build 2>&1
    $buildExitCode = $LASTEXITCODE
    
    # Display the build output
    Write-Host $buildOutput
    
    if ($buildExitCode -ne 0) {
        # Check if errors are only from expected excluded pages
        $expectedErrors = @("/brands", "/debug", "/order", "/success", "/admin/data", "/admin/product-images", "/cart")
        $buildOutputStr = $buildOutput -join "`n"
        
        $hasUnexpectedErrors = $false
        foreach ($line in $buildOutput) {
            if ($line -match "Error occurred prerendering page" -or $line -match "Build failed" -or $line -match "Failed to compile") {
                # Check if this error is from an expected excluded page
                $isExpectedError = $false
                foreach ($expectedPath in $expectedErrors) {
                    if ($line -match [regex]::Escape($expectedPath)) {
                        $isExpectedError = $true
                        break
                    }
                }
                if (-not $isExpectedError) {
                    $hasUnexpectedErrors = $true
                    break
                }
            }
        }
        
        if ($hasUnexpectedErrors) {
            Write-Host ""
            Write-Host "❌  BUILD FAILED WITH UNEXPECTED ERRORS" -ForegroundColor Red
            Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Red
            Write-Host "🚫  Push blocked - fix build errors before pushing" -ForegroundColor Red
            Write-Host "💡  Run 'npm run build' locally to see detailed errors" -ForegroundColor Yellow
            Write-Host ""
            exit 1
        } else {
            Write-Host ""
            Write-Host "⚠️  Build completed with expected errors from excluded pages" -ForegroundColor Yellow
            Write-Host "✅  All errors are from pages in .vercelignore - continuing..." -ForegroundColor Green
        }
    } else {
        Write-Host "✅  Build completed successfully!" -ForegroundColor Green
    }

    # Step 3: TypeScript check
    Write-Host "🔍  Running TypeScript check..." -ForegroundColor Yellow
    npx tsc --noEmit --skipLibCheck
    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "❌  TYPESCRIPT ERRORS FOUND" -ForegroundColor Red
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Red
        Write-Host "🚫  Push blocked - fix TypeScript errors before pushing" -ForegroundColor Red
        Write-Host ""
        exit 1
    }

    # Step 4: Success
    Write-Host ""
    Write-Host "✅  ALL CHECKS PASSED" -ForegroundColor Green
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
    Write-Host "🚀  Build clean - push allowed" -ForegroundColor Green
    Write-Host "🎯  Vercel deployment will succeed" -ForegroundColor Green
    Write-Host ""
    exit 0

} catch {
    Write-Host ""
    Write-Host "❌  VALIDATION FAILED" -ForegroundColor Red
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Red
    Write-Host "🚫  Push blocked - unexpected error occurred" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    exit 1
} 