# EECS767
                STEP 1 : Run the "Spider.rkt" file first A list of URL's can be provided as seeds which will be crawled to download pages from the internet. Please use the following commands after running the Spider.rkt file
            
                    (seed '("http://www.example.com" "http://www.another.com")
        
		The crawl can be started in two ways, there is a free crawl (no domain restriction)
    		Free crawl  :   (crawl  #no_of_pages)
        
                There is also a restricted crawl
                        Restricted :    (crawl!  #no_of_pages  "xyz"  "abc.com"  "")
                In restricted search a page will be downlaoded only if the URL contains either "xyz" or "abc.com". The fourth argument (currently an empty string) is the baser, useful for websites using relative links. (more on it in documentation)
        
                After the craw has completed the following files will be created in the "Exports/" directory
                        1. urls.txt
			2. titles.txt
                -----------------------------------
        
                STEP 2 : Run the "main.rkt" file. It will index all the documents and produce the following files in the "Exports/" directory. (may take a while depending on the heaviness & number of pages downloaded. Takes approximately 90 seconds for 100 pages.)
			1. Vectors.JSON
			2. idfvals.JSON
			3. terms.txt
		-----------------------------------
        
                STEP 3 : Copy all the 5 files created by Main.rkt & Spider.rkt to "gui/Index/"
                STEP 4 : Upload everything in the "gui/" directory to a web server
                
                Example : http://people.eecs.ku.edu/~cratnapa
                
                STEP 5 : Open a web browser and SEARCH AWAY...!


                Presentation >> http://prezi.com/a_usug4wmnfy/?utm_campaign=share&utm_medium=copy&rc=ex0share
