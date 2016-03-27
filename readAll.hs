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

------ TEST FUNCTIONS ------
data Stat = EndStat | Full Int Int Stat deriving (Show, Eq)
data InvInd = EndInd | Entry String Stat InvInd deriving (Show)

addDoc ::  InvInd -> [String] -> InvInd
addDoc x [] = x
addDoc  z (x:xs)= addDoc (addPosting 1 z x) xs 


addPosting :: Int -> InvInd -> String -> InvInd
addPosting y EndInd x = (Entry x (Full y 1 EndStat) EndInd)
addPosting y (Entry inDicString (Full docID docFreq rest) restInd) x = 
					if x == inDicString 
					then (Entry inDicString (Full docID (docFreq+1) rest) restInd)
					else (Entry inDicString (Full docID (docFreq) rest) (addPosting y restInd x ))



findPostings :: String -> InvInd -> Stat
findPostings [] _ = EndStat
findPostings _ EndInd = EndStat
findPostings x (Entry a b c) = if x == a then b else (findPostings x c)

getDF :: Stat -> Int -> Int
getDF EndStat x = x
getDF (Full a b c) x = (getDF c (x+1))
