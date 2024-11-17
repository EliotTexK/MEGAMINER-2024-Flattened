// AI
// This is where you build your AI

#include "ai.hpp"
#include <iostream>
#include <random>
#include <vector>
#include <queue>

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
    return "Ultimate_Cheezoid";
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

Tile AI::get_closer(Tile curr) {
    for (Tile neighbor : curr->get_neighbors()) {
        if (dists_to_op[neighbor->x][neighbor->y] != -1 && dists_to_op[neighbor->x][neighbor->y] < dists_to_op[curr->x][curr->y]) {
            return neighbor;
        }
    }
    return nullptr;
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

    // for (int i = 0; player->wizard->movement_left; i++) {
    //     Tile move_to;
    //     auto neighbors = player->wizard->tile->get_neighbors();
    //     vector<Tile> valid_nbrs;
    //     for (auto nbr : neighbors) {
    //         if (nbr->type != "wall") {
    //             valid_nbrs.push_back(nbr);
    //         }
    //     }
    //     move_to = valid_nbrs.at(rand() % valid_nbrs.size());
    //     player->wizard->move(move_to);
    // }
    calc_bfs();
    calc_sight();

    if (dists_to_op[player->wizard->tile->x][player->wizard->tile->y] > 5) {
        if (player->opponent->wizard->specialty == "sustaining"){
            if (sight_map[player->wizard->tile->x][player->wizard->tile->y]) {
                // get out of sight with bfs depth 2
                for (Tile neighbor : player->wizard->tile->get_neighbors()) {
                    if (neighbor->type != "wall") {
                        if (!sight_map[neighbor->x][neighbor->y]) {
                            player->wizard->move(neighbor);
                            return true;
                        } else {
                            for (Tile nneighbor : neighbor->get_neighbors()) {
                                if (nneighbor != neighbor && nneighbor->type != "wall") {
                                    if (!sight_map[nneighbor->x][nneighbor->y]) {
                                        player->wizard->move(neighbor);
                                        player->wizard->move(nneighbor);
                                        return true;
                                    }
                                }
                            }
                        }
                    }
                }

            }
        } else {
            if (dists_to_op[player->wizard->tile->x][player->wizard->tile->y] > 5) {
                // move closer
                Tile closer = get_closer(player->wizard->tile);
                player->wizard->move(closer);
            }
            if (dists_to_op[player->wizard->tile->x][player->wizard->tile->y] > 5) {
                // move closer
                Tile closer = get_closer(player->wizard->tile);
                player->wizard->move(closer);
                return true;
            }
        }
    }
    if (dists_to_op[player->wizard->tile->x][player->wizard->tile->y] == 5) {
        return true;
    }
    // dist to op is now less than 5
    switch (dists_to_op[player->wizard->tile->x][player->wizard->tile->y]) {
        case 4:
        {
            Tile closer = get_closer(player->wizard->tile);
            player->wizard->move(closer);
            if (player->wizard->movement_left > 0) {
                closer = get_closer(player->wizard->tile);
                player->wizard->move(closer);
            }
            player->wizard->cast("Fire Slash", player->opponent->wizard->tile); // should be in range
            return true;
        }
        case 3:
        {
            Tile closer = get_closer(player->wizard->tile);
            player->wizard->move(closer);
            if (player->wizard->aether - 2 > 0) {
                player->wizard->cast("Fire Slash", player->opponent->wizard->tile); // should be in range
            }
            closer = get_closer(player->wizard->tile);
            player->wizard->move(closer);
            return true;
        }
        case 2:
        {
            Tile closer = get_closer(player->wizard->tile);
            player->wizard->move(closer);
            if (player->wizard->aether - 2 > 0) {
                player->wizard->cast("Fire Slash", player->opponent->wizard->tile); // should be in range
            }
            return true;
        }
        case 1:
        {
            if (player->wizard->aether - 2 > 0) {
                player->wizard->cast("Fire Slash", player->opponent->wizard->tile); // should be in range
            }
            return true;
        }
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

void AI::calc_bfs() {
    for (int y = 0; y < 10; y++) {
        for (int x = 0; x < 10; x++) {
            dists_to_op[x][y] = -1; // untraversed
        }
    }
    std::queue<Tile> bfs;
    Tile optile = player->opponent->wizard->tile;
    bfs.push(optile);
    dists_to_op[optile->x][optile->y] = 0;
    while (bfs.size() > 0) {
        Tile top = bfs.front();
        bfs.pop();

        for (Tile neighbor : top->get_neighbors()) {
            if (neighbor->type != "wall"
                && (neighbor->object == nullptr || !(
                       neighbor->object->form == "explosion rune"
                    || neighbor->object->form == "teleport rune"
                    || neighbor->object->form == "charge rune"
                    || neighbor->object->form == "stone rune"
                ))
                && dists_to_op[neighbor->x][neighbor->y] == -1) {
                bfs.push(neighbor);
        
                dists_to_op[neighbor->x][neighbor->y] = dists_to_op[top->x][top->y] + 1;
        
                // TODO: check stones/tele runes/explosion runes
            }
        }
    }
}

#include <cmath>
/**
 * Line drawing algorithm for projectiles.
 * Given a Tile and a line, tries to find next Tile nearest to that line.
 *
 * @param x0 - x coordinate of first point on line.
 * @param y0 - y coordinate of first point on line.
 * @param x1 - x coordinate of second point on line.
 * @param y1 - y coordinate of second point on line.
 * @param current - the Tile to start from.
 * @returns The Tile that approximately continues the line.
 */
Tile AI::bressenham(int x0, int y0, int x1, int y1, Tile current) {
    // First we describe the slope of the line
    int dx = x1 - x0;
    int sx = x0 < x1 ? 1 : -1;

    int dy = y1 - y0;
    int sy = y0 < y1 ? 1 : -1;

    float cx = dx > dy ? 1 : 0.5;
    float cy = dx > dy ? 0.5 : 1;

    // If the line is diagonal, we have to note it
    bool isDiag = (abs(dx) == abs(dy));

    // We also need the y-intercept
    // Thankfully TypeScript stores all numbers as floats by default
    float b = float(y0 - dy) / float(dx * x0);

    // If a point (x,y) is on the line, then dy*x - dx*y + dx*b = 0.
    // Its parity also tells us how good a nearby tile approximates the line.
    float f = dy*(current->x + sx*cx) - dx*(current->y + sy*cy) + dx*b;

    // Now we choose the best tile for the line.
    // We always update the coordinate that changes quicker.
    // If f is positive or the slope is 1, we also update the other coordinate.
    // Since this function is being called outside the game class, we can't just tilemap this.
    // So we have to go case by case.
    enum Direction {
        NORTH, WEST, SOUTH, EAST,
    };
    Direction vert = NORTH;
    Direction horiz = WEST;
    if (sy > 0) {
        vert = SOUTH;
    }

    if (sx > 0) {
        horiz = EAST;
    }

    auto get_neighbor = [](Tile tile, Direction dir)->Tile{
        //std::cout << "checking: " << tile->x << ", " << tile->y << ", " << dir << std::endl;
        //std::cout << tile->tile_north << tile->tile_south << tile->tile_east << tile->tile_west << std::endl;
        switch(dir) {
            case NORTH:
                return tile->tile_north->type != "wall" ? tile->tile_north : nullptr;
            case SOUTH:
                return tile->tile_south->type != "wall" ? tile->tile_south : nullptr;
            case EAST:
                return tile->tile_east->type != "wall" ? tile->tile_east : nullptr;
            case WEST:
                return tile->tile_west->type != "wall" ? tile->tile_west : nullptr;
            default:
                std::cout << "THIS IS BAD!!!\n";
                return nullptr;
        }
    };
    if (abs(dy) > abs(dx)) {
        Tile neighbor = get_neighbor(current,vert);
        if ((isDiag || f > 0) && dx != 0) {
            if (neighbor == nullptr) return nullptr;
            return get_neighbor(neighbor,horiz);
        }
        return neighbor;
    }
    else {
        Tile neighbor = get_neighbor(current,horiz);
        if ((isDiag || f > 0) && dy != 0) {
            if (neighbor == nullptr) return nullptr;
            return get_neighbor(neighbor,vert);
        }
        return neighbor;
    }
}

bool AI::is_in_sight(Tile sniper, Tile target) {
    Tile prev = sniper;
    Tile next = bressenham(sniper->x, sniper->y, target->x, target->y, prev);
    //std::cout << prev->x << ", " << prev->y << ", " << next << std::endl;
    while (next != nullptr && next->type == "floor" && !(prev->x == target->x && prev->y == target->y)) { // stones?
        prev = next;
        next = bressenham(sniper->x, sniper->y, target->x, target->y, prev);
        //std::cout << prev->x << ", " << prev->y << std::endl;
    }
    // no next was found: destination is in prev
    return prev->x == target->x && prev->y == target->y;
}

void AI::calc_sight() {
    for (int y = 0; y < 10; y++) {
        for (int x = 0; x < 10; x++) {
            int index = x + y*10;
            sight_map[x][y] = is_in_sight(player->opponent->wizard->tile, game->tiles.at(index));
            //std::cout << (sight_map[x][y] ? "!" : ".");
        }
        //std::cout << "\n";
    }
}

//<<-- /Creer-Merge: methods -->>

} // magomachy

} // cpp_client
