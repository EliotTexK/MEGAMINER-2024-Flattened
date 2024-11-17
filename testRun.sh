lsof -i tcp:3080 | awk 'NR!=1 {print $2}' | xargs kill

cd Cerveau
npm start &

cd ..
cd Joueur.cpp/build
cmake build ..
cd ..
make

sleep 5

./run magomachy &
./run magomachy