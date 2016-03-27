import Control.Applicative
import System.FilePath
import System.Directory
import System.IO  
import Control.Monad

isRegularFileOrDirectory :: FilePath -> Bool
isRegularFileOrDirectory f = f /= "." && f /= ".."

getList :: IO [FilePath]
getList = fmap cleanUp (getDirectoryContents "./data/")
 
cleanUp :: [String] -> [String]
cleanUp [] = []
cleanUp (".":xs) = cleanUp xs
cleanUp ("..":xs) = cleanUp xs
cleanUp ((x:xs):ys) = if x == '<' then cleanUp ys else ((x:xs):(cleanUp ys))

fake = ["data/test.html", "data/test1.html"]


iterateMe :: [String] -> IO [String]
iterateMe [] = getList
--iterateMe (x:xs) = 

iterations = fmap length getList
{-
doall :: IO [FilePath] -> IO [String]
doall x = if  then return else (doit 0)


tellTruth :: IO (Bool) -> Bool
tellTruth a = if (fmap (== 0) (fmap length x))
-}

something = fmap cleanUp $ (correctPath (fmap head getList)) >>= galaxy
otherThing = fmap cleanUp $ (correctPath (fmap head (fmap tail getList))) >>= galaxy

dummy = ["Dummy"]

doit :: Int -> IO [String]
doit x = (fmap cleanUp $ (getElem x) >>= galaxy)

galaxy :: FilePath -> IO [String]
galaxy x = fmap words ((openFile x ReadMode) >>= hGetContents)

-- Takes an IO String for filename and adds a prefix "data/" in it.
correctPath :: Functor f => f [Char] -> f [Char]
correctPath x = fmap ("data/" ++ ) x

-- Gives you a particular element from getList
getElem :: Int -> IO [Char]
getElem m = correctPath $ fmap (!! m) getList