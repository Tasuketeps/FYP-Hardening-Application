This is a draft policy scraper, how it works is that it actually uses secedit export to export into a Setup Information file
which is apparently the files used to import/export security settings for policies. So we essentially convert this file into CSV
format. 

#### How to use #####

Edit the paths to where you want the files to be exported to
run this command 
PowerShell -ExecutionPolicy Bypass -File .\scraping_policies.ps1
