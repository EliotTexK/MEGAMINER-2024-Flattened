// AI
// This is where you build your AI

#include "ai.hpp"
#include <iostream>
#include <random>
#include <vector>
#include <algorithm>

using namespace std;

// <<-- Creer-Merge: includes -->> - Code you add between this comment and the end comment will be preserved between Creer re-runs.
// You can add #includes here for your AI.
// <<-- /Creer-Merge: includes -->>

namespace cpp_client
{

namespace magomachy
{

/// <summary>
/// This returns your AI's name to the game server.
/// Replace the string name.
/// </summary>
/// <returns>The name of your AI.</returns>
std::string AI::get_name() const
{
    // <<-- Creer-Merge: get-name -->> - Code you add between this comment and the end comment will be preserved between Creer re-runs.
    // REPLACE WITH YOUR TEAM NAME!
    return "TreeChoppa";
    // <<-- /Creer-Merge: get-name -->>
}

/// <summary>
/// This is automatically called when the game first starts, once the game objects are created
/// </summary>
void AI::start()
{
    // <<-- Creer-Merge: start -->> - Code you add between this comment and the end comment will be preserved between Creer re-runs.
    // This is a good place to initialize any variables
    // <<-- /Creer-Merge: start -->>
}

/// <summary>
/// This is automatically called the game (or anything in it) updates
/// </summary>
void AI::game_updated()
{
    // <<-- Creer-Merge: game-updated -->> - Code you add between this comment and the end comment will be preserved between Creer re-runs.
    // If a function you call triggers an update this will be called before it returns.
    // <<-- /Creer-Merge: game-updated -->>
}

/// <summary>
/// This is automatically called when the game ends.
/// </summary>
/// <param name="won">true if you won, false otherwise</param>
/// <param name="reason">An explanation for why you either won or lost</param>
void AI::ended(bool won, const std::string& reason)
{
    //<<-- Creer-Merge: ended -->> - Code you add between this comment and the end comment will be preserved between Creer re-runs.
    // You can do any cleanup of your AI here.  The program ends when this function returns.
    //<<-- /Creer-Merge: ended -->>
}

/// <summary>
/// This is called whenever your wizard selects an action.
/// </summary>
/// <param name="wizard">Wizard performs action.</param>
/// <returns>Three of the choices a Wizard can make as an action.</returns>
int AI::action(const Wizard& wizard)
{
    // <<-- Creer-Merge: Action -->> - Code you add between this comment and the end comment will be preserved between Creer re-runs.
    // Put your game logic here for action here
    // <<-- /Creer-Merge: Action -->>
    return 0;
}
/// <summary>
/// This is called whenever your wizard makes a move.
/// </summary>
/// <param name="wizard">Wizard moves.</param>
/// <returns>Eight cardinal directions.</returns>
int AI::move(const Wizard& wizard)
{
    // <<-- Creer-Merge: Move -->> - Code you add between this comment and the end comment will be preserved between Creer re-runs.
    // Put your game logic here for move here
    // <<-- /Creer-Merge: Move -->>
    return 0;
}
/// <summary>
/// This is called every time it is this AI.player's turn.
/// </summary>
/// <returns>Represents if you want to end your turn. True means end your turn, False means to keep your turn going and re-call this function.</returns>
bool AI::run_turn()
{
    // <<-- Creer-Merge: runTurn -->> - Code you add between this comment and the end comment will be preserved between Creer re-runs.
    // Put your game logic here for run_turn here
    // <<-- /Creer-Merge: runTurn -->>
    static int turn = 0;
    if (turn == 0) {
        player->choose_wizard("aggressive");
        turn++;
        return true;
    }

    for (int i = 0; player->wizard->movement_left; i++) {
        Tile move_to;
        auto neighbors = player->wizard->tile->get_neighbors();
        vector<Tile> valid_nbrs;
        for (auto nbr : neighbors) {
            if (nbr->type != "wall") {
                valid_nbrs.push_back(nbr);
            }
        }
        move_to = valid_nbrs.at(rand() % valid_nbrs.size());
        player->wizard->move(move_to);
    }
    turn++;
    return true;
}

/// A very basic path finding algorithm (Breadth First Search) that when given a starting Tile, will return a valid path to the goal Tile.
/// <param name="start">the starting Tile</param>
/// <param name="goal">the goal Tile</param>
/// <return>A List of Tiles representing the path, the the first element being a valid adjacent Tile to the start, and the last element being the goal. Or an empty list if no path found.</return>
std::vector<Tile> AI::find_path(const Tile& start, const Tile& goal)
{
    // no need to make a path to here...
    if(start == goal)
    {
        return {};
    }

    // the tiles that will have their neighbors searched for 'goal'
    std::queue<Tile> fringe;

    // How we got to each tile that went into the fringe.
    std::unordered_map<Tile,Tile> came_from;

    // Enqueue start as the first tile to have its neighbors searched.
    fringe.push(start);

    // keep exploring neighbors of neighbors... until there are no more.
    while(fringe.size() > 0)
    {
        // the tile we are currently exploring.
        Tile inspect = fringe.front();
        fringe.pop();

        // Note, we are using the `auto` keyword here
        //   The compiler can discern that this is a `std::vector<Tile>` based on the return type of `getNeighbors()`
        auto neighbors = inspect->get_neighbors();

        // cycle through the tile's neighbors.
        for(unsigned i = 0; i < neighbors.size(); i++)
        {
            Tile neighbor = neighbors[i];

            // If we found the goal we've found the path!
            if(neighbor == goal)
            {
                // Follow the path backward starting at the goal and return it.
                std::deque<Tile> path;
                path.push_front(goal);

                // Starting at the tile we are currently at, insert them retracing our steps till we get to the starting tile
                for(Tile step = inspect; step != start; step = came_from[step])
                {
                    path.push_front(step);
                }

                // we want to return a vector as that's what we use for all containers in C++
                // (and they don't have push_front like we need)
                // So construct the vector-ized path here
                std::vector<Tile> vector_path;
                for(auto& tile : path)
                {
                    vector_path.push_back(tile);
                }
                return vector_path;
            }

            // if the tile exists, has not been explored or added to the fringe yet, and it is pathable
            if(neighbor && came_from.count(neighbor) == 0 && neighbor->is_pathable())
            {
                // add it to the tiles to be explored and add where it came from.
                fringe.push(neighbor);
                came_from[neighbor] = inspect;
            }

        } // for each neighbor

    } // while fringe not empty

    // if you're here, that means that there was not a path to get to where you want to go.
    //   in that case, we'll just return an empty path.
    return {};
}

//<<-- Creer-Merge: methods -->> - Code you add between this comment and the end comment will be preserved between Creer re-runs.
// You can add additional methods here for your AI to call
//<<-- /Creer-Merge: methods -->>

std::vector<StackFrame> AI::gen_aggressive() {

}

std::vector<StackFrame> AI::gen_defensive() {

}

std::vector<StackFrame> AI::gen_sustaining() {

}

std::vector<StackFrame> AI::gen_strategic() {

}


static constexpr size_t TRUNC_SIZE = 100;
std::vector<StackFrame> AI::gen_frames(StackFrame &prev){
    std::vector<StackFrame> ret;
    switch (our_type) {
        case WizardType::AGGRESSIVE:
            ret = gen_aggressive();
            break;
        case AI::WizardType::DEFENSIVE:
            ret = gen_defensive();
            break;
        case AI::WizardType::SUSTAINING:
            ret = gen_sustaining();
            break;
        case AI::WizardType::STRATEGIC:
            ret = gen_strategic();
            break;
    }
    // get frame values
    for (auto &frame : ret) {
        evaluate_frame(frame);
    }
    // prune by truncating lowest values
    std::sort(ret.begin(), ret.end(), 
        [](StackFrame &item1, StackFrame &item2)->{
            return item1.value > item2.value;
        });
    if (ret.size() > TRUNC_SIZE) {
        ret.resize(TRUNC_SIZE);
    }
    return ret;
}

void AI::evaluate_frame(StackFrame &frame) {
    frame.value = 0;
    frame.value += frame.wizard.hp;
    frame.value += frame.wizard.mp;
    frame.value -= frame.op.hp;
    frame.value -= frame.op.mp;
}

uint64_t AI::get_sum(StackFrame &frame, int depth) {
    return 0;
}

void AI::update_flask_timers() {

}

} // magomachy

} // cpp_client
