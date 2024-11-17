# This is where you build your AI for the Magomachy game.

from typing import List
from joueur.base_ai import BaseAI
import random

# <<-- Creer-Merge: imports -->> - Code you add between this comment and the end comment will be preserved between Creer re-runs.
# you can add additional import(s) here
# <<-- /Creer-Merge: imports -->>

class AI(BaseAI):
    """ The AI you add and improve code inside to play Magomachy. """

    @property
    def game(self) -> 'games.magomachy.game.Game':
        """games.magomachy.game.Game: The reference to the Game instance this AI is playing.
        """
        return self._game # don't directly touch this "private" variable pls

    @property
    def player(self) -> 'games.magomachy.player.Player':
        """games.magomachy.player.Player: The reference to the Player this AI controls in the Game.
        """
        return self._player # don't directly touch this "private" variable pls

    def get_name(self) -> str:
        """This is the name you send to the server so your AI will control the player named this string.

        Returns:
            str: The name of your Player.
        """
        # <<-- Creer-Merge: get-name -->> - Code you add between this comment and the end comment will be preserved between Creer re-runs.
        return "Magomachy Python Player" # REPLACE THIS WITH YOUR TEAM NAME
        # <<-- /Creer-Merge: get-name -->>

    def start(self) -> None:
        """This is called once the game starts and your AI knows its player and game. You can initialize your AI here.
        """
        # <<-- Creer-Merge: start -->> - Code you add between this comment and the end comment will be preserved between Creer re-runs.
        # replace with your start logic
        self.player.choose_wizard("map")
        # <<-- /Creer-Merge: start -->>

    def game_updated(self) -> None:
        """This is called every time the game's state updates, so if you are tracking anything you can update it here.
        """
        # <<-- Creer-Merge: game-updated -->> - Code you add between this comment and the end comment will be preserved between Creer re-runs.
        # replace with your game updated logic
        # <<-- /Creer-Merge: game-updated -->>

    def end(self, won: bool, reason: str) -> None:
        """This is called when the game ends, you can clean up your data and dump files here if need be.

        Args:
            won (bool): True means you won, False means you lost.
            reason (str): The human readable string explaining why your AI won or lost.
        """
        # <<-- Creer-Merge: end -->> - Code you add between this comment and the end comment will be preserved between Creer re-runs.
        # replace with your end logic
        # <<-- /Creer-Merge: end -->>
    def action(self, wizard: 'games.magomachy.wizard.Wizard') -> int:
        """This is called whenever your wizard selects an action.

        Args:
            wizard (games.magomachy.wizard.Wizard): Wizard performs action.

        Returns:
            int: Three of the choices a Wizard can make as an action.
        """
        # <<-- Creer-Merge: Action -->> - Code you add between this comment and the end comment will be preserved between Creer re-runs.
        # Put your game logic here for Action
        return -1
        # <<-- /Creer-Merge: Action -->>
    def move(self, wizard: 'games.magomachy.wizard.Wizard') -> int:
        """This is called whenever your wizard makes a move.

        Args:
            wizard (games.magomachy.wizard.Wizard): Wizard moves.

        Returns:
            int: Eight cardinal directions.
        """
        # <<-- Creer-Merge: Move -->> - Code you add between this comment and the end comment will be preserved between Creer re-runs.
        # Put your game logic here for Move
        return -1
        # <<-- /Creer-Merge: Move -->>
    def run_turn(self) -> bool:
        print(self.player.wizard)
        """This is called every time it is this AI.player's turn.

        Returns:
            bool: Represents if you want to end your turn. True means end your turn, False means to keep your turn going and re-call this function.
        """
        notChosen = True
        print("Your turn! Here's the map:")
        while(True):
            self.player.choose_wizard("map")
            if not self.player.wizard and notChosen:
                print("WARNING: You have not chosen a wizard. Do that ASAP!")
            elif self.player.wizard:
                print("HEALTH:",self.player.wizard.health)
                print("AETHER",self.player.wizard.aether)
            
            choice = input('What next? Type help for a list of commands.')
            components = choice.split()
            if len(components) == 0:
                pass
            elif components[0] == 'help':
                print("Valid commands:")
                print("choose [wizardClass]: pick a class at the start of the game")
                print("move [up, down, right, left]: move in specified direction.")
                print("cast [spell] [x] [y]: cast spell at specified coordinate")
                print("spells [wizardClass]: see spell list for given wizard")
            elif components[0] == 'spells':
                print("Punch: 0 aether, 1 damage, 1 range")
                if components[1] == 'aggressive':
                    print("Fire Slash: 2 aether, 3 damage, 2 range")
                    print("Thunderous Dash: 3 aether, boosts speed by 2 for 1 turn, lets you swap places with enemy if you pass them")
                    print("Furious Telekinesis: 4 aether, 1 range, pushes item away, forces other wizard to use it if it hits them")
                elif components[1] == 'defensive':
                    print("Rock Lob: 2 aether, 2 damage, exactly 2 or 3 tile range")
                    print("Force Push: 3 aether, pushes adjacent opponent up to 4 spaces, using items along the way. 3 damage if they hit a wall")
                    print("Stone Summon: 4 aether, 1 range, summon impassable stone for 10 total turns")
                elif components[1] == 'sustaining':
                    print("Calming Blast: 3 aether, fires projectile, on hit steal 1 HP and decrease speed for 1 turn")
                    print("Teleport: 3 aether, 2 range, move to target tile. Also costs 1 movement.")
                    print("Dispel Magic: 3 aether, 1 range, deletes target item/rune")
                elif components[1] == 'strategic':
                    print("Explosion Rune: 2 aether, 4 damage, 1 range, blows up for 4 damage when stepped on")
                    print("Heal Rune: 5 aether, 1 range, heals for 5 HP when stepped on (up to max)")
                    print("Teleport Rune: 3 aether (0 if rune already placed), 1 range, places teleport rune if none exists, or teleports you to it otherwise")
                    print("Charge Rune: 4 aether, infinite range, blows up for 5 damage in 3 tile radius after 5 turns")
                    print("Force Pull: 3 aether, 4 range, fires projectile that does no damage, but drags opponent toward you if it hits them, using runes along the way")
                else:
                    print("That's not a wizard! Choose aggressive, defensive, sustaining, or strategic.")
            elif components[0] == 'end':
                print("Ending turn...")
                break;
            elif components[0] == 'choose':
                wizard = None
                
                if self.player.wizard:
                    print("You've already chosen a wizard!")
                elif len(components) != 2:
                    print("Wrong number of arguments!")
                elif (components[1] == 'aggressive'
                or components[1] == 'defensive'
                or components[1] == 'sustaining'
                or components[1] == 'strategic'):
                    wizard = components[1]
                else:
                    print("Choose aggressive, defensive, sustaining, or strategic.")
                
                if wizard:
                    self.player.choose_wizard(wizard)
                    notChosen = False
            elif components[0] == 'move':
                tile = None
                if len(components) != 2:
                    tile = None
                elif components[1] == 'left':
                    tile = self.player.wizard.tile.tile_west
                elif components[1] == 'right':
                    tile = self.player.wizard.tile.tile_east
                elif components[1] == 'down':
                    tile = self.player.wizard.tile.tile_south
                elif components[1] == 'up':
                    tile = self.player.wizard.tile.tile_north
                if tile:
                    self.player.wizard.move(tile)
                else:
                    print("Command not executed. Choose a direction.")
            elif components[0] == 'cast':
                #if self.player.wizard.has_cast:
                    #print("You've already cast a spell this turn...")
                if len(components) < 4 or len(components) > 5:
                    print("Wrong number of arguments")
                else:
                    spell = components[1]
                    x = components[2]
                    y = components[3]
                    if len(components) == 5:
                        spell = components[1] + " " + components[2]
                        x = components[3]
                        y = components[4]
                    if not x.isdigit() or not y.isdigit():
                        print("Choose actual coordinates...")
                    else:
                        tile = self.game.get_tile_at(int(x),int(y))
                        self.player.wizard.cast(spell,tile)
            else:
                print("Command not recognized, try again")
        # <<-- Creer-Merge: runTurn -->> - Code you add between this comment and the end comment will be preserved between Creer re-runs.
        # Put your game logic here for runTurn
        return True
        # <<-- /Creer-Merge: runTurn -->>

    def find_path(self, start: 'games.magomachy.tile.Tile', goal: 'games.magomachy.tile.Tile') -> List['games.magomachy.tile.Tile']:
        """A very basic path finding algorithm (Breadth First Search) that when given a starting Tile, will return a valid path to the goal Tile.

        Args:
            start (games.magomachy.tile.Tile): The starting Tile to find a path from.
            goal (games.magomachy.tile.Tile): The goal (destination) Tile to find a path to.

        Returns:
            list[games.magomachy.tile.Tile]: A list of Tiles representing the path, the the first element being a valid adjacent Tile to the start, and the last element being the goal.
        """

        if start == goal:
            # no need to make a path to here...
            return []

        # queue of the tiles that will have their neighbors searched for 'goal'
        fringe = []

        # How we got to each tile that went into the fringe.
        came_from = {}

        # Enqueue start as the first tile to have its neighbors searched.
        fringe.append(start)

        # keep exploring neighbors of neighbors... until there are no more.
        while len(fringe) > 0:
            # the tile we are currently exploring.
            inspect = fringe.pop(0)

            # cycle through the tile's neighbors.
            for neighbor in inspect.get_neighbors():
                # if we found the goal, we have the path!
                if neighbor == goal:
                    # Follow the path backward to the start from the goal and
                    # # return it.
                    path = [goal]

                    # Starting at the tile we are currently at, insert them
                    # retracing our steps till we get to the starting tile
                    while inspect != start:
                        path.insert(0, inspect)
                        inspect = came_from[inspect.id]
                    return path
                # else we did not find the goal, so enqueue this tile's
                # neighbors to be inspected

                # if the tile exists, has not been explored or added to the
                # fringe yet, and it is pathable
                if neighbor and neighbor.id not in came_from and (
                    neighbor.is_pathable()
                ):
                    # add it to the tiles to be explored and add where it came
                    # from for path reconstruction.
                    fringe.append(neighbor)
                    came_from[neighbor.id] = inspect

        # if you're here, that means that there was not a path to get to where
        # you want to go; in that case, we'll just return an empty path.
        return []

    # <<-- Creer-Merge: functions -->> - Code you add between this comment and the end comment will be preserved between Creer re-runs.
    # if you need additional functions for your AI you can add them here
    # <<-- /Creer-Merge: functions -->>