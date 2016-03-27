getList = filter isRegularFileOrDirectory <$> getDirectoryContents "./data/"

test :: Int -> Int
test x = 5

doall :: IO [FilePath] -> IO [String]
doall x = if (fmap (== 0) (fmap length x)) then return else (doit 0)


doit :: Int -> IO [String]
doit x = fmap cleanUp $ (getElem x) >>= galaxy

galaxy :: FilePath -> IO [String]
galaxy x = fmap words (nebula x)

nebula :: FilePath -> IO String
nebula x = (space x) >>= hGetContents

space :: FilePath -> IO Handle
space x = openFile x ReadMode