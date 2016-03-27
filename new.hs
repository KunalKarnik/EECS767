import System.IO  
import Control.Monad

--tags = ["<html>", "<body>", "<p>", "</p>", "</html>"];

main = do  
        let list = []
        handle <- openFile "*.html" ReadMode
        contents <- hGetContents handle
        let singlewords = words contents
        print $ hyperBelongsTo singlewords
        --print singlewords
        hClose handle

--process (x:xs) = if belongsTo x tags then process xs else (x:xs)
--belongsTo x y = elem x y

hyperBelongsTo :: [[Char]] -> [[Char]]
hyperBelongsTo [] = []
hyperBelongsTo ((x:xs):ys) = if x == '<' then hyperBelongsTo ys else ((x:xs):(hyperBelongsTo ys))

f :: [String] -> [[Char]]
f = map read

add0 :: Int -> Int -> Int
add0 x y = x+y 