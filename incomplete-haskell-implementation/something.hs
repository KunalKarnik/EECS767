getList :: [String]
getList = ["test.html", "test1.html"]

doc1 :: [String]


doc1 = ["this", "is", "the", "first", "document", "the", "first", "very", "first", "document", "this", "is"]
doc2 = ["This", "is", "doc2"]
doc = [doc1, doc2]


ourDictionary = EndInd



totalDocs :: Int
totalDocs = length getList

sample :: InvInd
sample = Entry "Kunal" (Full 1 3 (Full 2 3 EndStat)) (Entry "Hi" (Full 1 2 EndStat) (Entry "Hello" (Full 1 3 (Full 2 4 EndStat)) EndInd))

data Stat = EndStat | Full Int Int Stat deriving (Show, Eq)
data InvInd = EndInd | Entry String Stat InvInd deriving (Show)

addDoc :: [String] -> Int -> InvInd -> InvInd
addDoc [] _ x = x
addDoc (x:xs) y z = addDoc xs y (addPosting y z x)


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