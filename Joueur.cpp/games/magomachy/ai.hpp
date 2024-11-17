#ifndef GAMES_MAGOMACHY_AI_HPP
#define GAMES_MAGOMACHY_AI_HPP

#include "impl/magomachy.hpp"
#include "game.hpp"
#include "game_object.hpp"
#include "item.hpp"
#include "player.hpp"
#include "tile.hpp"
#include "wizard.hpp"

#include "../../joueur/src/base_ai.hpp"
#include "../../joueur/src/attr_wrapper.hpp"

// <<-- Creer-Merge: includes -->> - Code you add between this comment and the end comment will be preserved between Creer re-runs.
// You can add additional #includes here
// <<-- /Creer-Merge: includes -->>

namespace cpp_client
{

namespace magomachy
{

enum MoveType : uint16_t {

};

struct Move {
    MoveType type;
    uint8_t x, y;
};

enum RuneType {
    NOTHING,
    HEAL,
    TELEPORT,
    CHARGE,
    EXPLOSION,
    STONE,
};

struct StackFrame {
    int64_t value;
    Move move[5];
    struct {
        uint8_t x, y;
        uint8_t hp, mp;
        bool is_slow;
    } wizard, op;
    uint8_t flask_timers[6];
    uint8_t rune_info[8][8]; // three LSB are one of RuneType
    // rune_info[x][y] >> 3 is associated timeout
};

/// <summary>
/// This is the header file for building your Magomachy AI
/// </summary>
class AI : public Base_ai
{
public:
    /// <summary>
    /// This is a reference to the Game object itself, it contains all the information about the current game
    /// </summary>
    Game game;

    /// <summary>
    /// This is a pointer to your AI's player. This AI class is not a player, but it should command this Player.
    /// </summary>
    Player player;

    //<<-- Creer-Merge: class variables -->> - Code you add between this comment and the end comment will be preserved between Creer re-runs.
    // You can add additional class variables here.
    //<<-- /Creer-Merge: class variables -->>

    /// <summary>
    /// This returns your AI's name to the game server.
    /// Replace the string name.
    /// </summary>
    /// <returns>The name of your AI.</returns>
    virtual std::string get_name() const override;

    /// <summary>
    /// This is automatically called when the game first starts, once the game objects are created
    /// </summary>
    virtual void start() override;

    /// <summary>
    /// This is automatically called when the game ends.
    /// </summary>
    /// <param name="won">true if you won, false otherwise</param>
    /// <param name="reason">An explanation for why you either won or lost</param>
    virtual void ended(bool won, const std::string& reason) override;

    /// <summary>
    /// This is automatically called the game (or anything in it) updates
    /// </summary>
    virtual void game_updated() override;

    /// <summary>
    /// This is called whenever your wizard selects an action.
    /// </summary>
    /// <param name="wizard">Wizard performs action.</param>
    /// <returns>Three of the choices a Wizard can make as an action.</returns>
    int action(const Wizard& wizard);
    /// <summary>
    /// This is called whenever your wizard makes a move.
    /// </summary>
    /// <param name="wizard">Wizard moves.</param>
    /// <returns>Eight cardinal directions.</returns>
    int move(const Wizard& wizard);
    /// <summary>
    /// This is called every time it is this AI.player's turn.
    /// </summary>
    /// <returns>Represents if you want to end your turn. True means end your turn, False means to keep your turn going and re-call this function.</returns>
    bool run_turn();

    // <<-- Creer-Merge: methods -->> - Code you add between this comment and the end comment will be preserved between Creer re-runs.
    // You can add additional methods here.
    // <<-- /Creer-Merge: methods -->>

    /// A very basic path finding algorithm (Breadth First Search) that when given a starting Tile, will return a valid path to the goal Tile.
    /// <param name="start">the starting Tile</param>
    /// <param name="goal">the goal Tile</param>
    /// <return>A List of Tiles representing the path, the the first element being a valid adjacent Tile to the start, and the last element being the goal. Or an empty list if no path found.</return>
    std::vector<Tile> find_path(const Tile& start, const Tile& goal);



    // ####################
    // Don't edit these!
    // ####################
    /// \cond FALSE
    virtual std::string invoke_by_name(const std::string& name,
                                       const std::unordered_map<std::string, Any>& args) override;
    virtual void set_game(Base_game* ptr) override;
    virtual void set_player(std::shared_ptr<Base_object> obj) override;
    virtual void print_win_loss_info() override;
    /// \endcond
    // ####################
    // Don't edit these!
    // ####################


    enum WizardType {
        AGGRESSIVE, DEFENSIVE, SUSTAINING, STRATEGIC,
    };

    WizardType our_type, op_type;

    uint8_t flask_times[6]; // health: N, E, S, W; mana: NW, SE
    void update_flask_timers();

    std::vector<StackFrame> gen_aggressive(StackFrame &prev);
    std::vector<StackFrame> gen_defensive(StackFrame &prev);
    std::vector<StackFrame> gen_sustaining(StackFrame &prev);
    std::vector<StackFrame> gen_strategic(StackFrame &prev);

    std::vector<StackFrame> gen_frames(StackFrame &prev); // calls other gens and does pruning

    uint64_t get_sum(StackFrame &frame, int depth);

    void evaluate_frame(StackFrame &frame);

};

} // MAGOMACHY

} // cpp_client

#endif // GAMES_MAGOMACHY_AI_HPP
