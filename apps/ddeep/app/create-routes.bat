@echo off
echo Creating route files...

REM Make sure routes folder exists
IF NOT EXIST routes (
  echo ❌ routes folder not found.
  pause
  exit /b
)

REM Create route files
type nul > routes\_index.tsx
type nul > routes\services.tsx
type nul > routes\services._index.tsx
type nul > routes\services.deep-clean.tsx
type nul > routes\services.regular.tsx
type nul > routes\tc.tsx

echo ✅ Route files created successfully!
pause
