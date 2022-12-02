import { readFile } from 'node:fs/promises';

const main = async () => {
    const input = await readFile('./src/2/input.txt', 'utf8');

    enum Move {
        Rock = 1,
        Paper = 2,
        Scissors = 3,
    }

    enum Result {
        Win = 6,
        Draw = 3,
        Lose = 0,
    }

    const roundEvaluationMap: Record<Move, Record<Move, Result>> = {
        [Move.Rock]: {
            [Move.Rock]: Result.Draw,
            [Move.Paper]: Result.Lose,
            [Move.Scissors]: Result.Win,
        },
        [Move.Paper]: {
            [Move.Rock]: Result.Win,
            [Move.Paper]: Result.Draw,
            [Move.Scissors]: Result.Lose,
        },
        [Move.Scissors]: {
            [Move.Rock]: Result.Lose,
            [Move.Paper]: Result.Win,
            [Move.Scissors]: Result.Draw,
        },
    };

    type AdversaryRawMove = 'A' | 'B' | 'C';
    type OwnRawMove = 'X' | 'Y' | 'Z';

    const moveDecrypt = (input: AdversaryRawMove | OwnRawMove): Move => {
        switch (input) {
            case 'A':
            case 'X': {
                return Move.Rock;
            }
            case 'B':
            case 'Y': {
                return Move.Paper;
            }
            case 'C':
            case 'Z': {
                return Move.Scissors;
            }
        }
    };

    const calculateRoundScore = (ownMove: Move, roundResult: Result): number => {
        let score = 0;

        if (roundResult === Result.Win) score += Result.Win;
        if (roundResult === Result.Draw) score += Result.Draw;

        if (ownMove === Move.Rock) score += Move.Rock;
        if (ownMove === Move.Paper) score += Move.Paper;
        if (ownMove === Move.Scissors) score += Move.Scissors;

        return score;
    };

    let partOneScore = 0;
    const rounds = input.split('\n');
    for (const round of rounds) {
        const [adversaryRawMove, ownRawMove] = round.split(' ') as [AdversaryRawMove, OwnRawMove];
        const [adversaryMove, ownMove] = [moveDecrypt(adversaryRawMove), moveDecrypt(ownRawMove)];

        const roundResult = roundEvaluationMap[ownMove][adversaryMove];

        partOneScore += calculateRoundScore(ownMove, roundResult);
    }

    console.log('Part one score:', partOneScore);

    const getDesiredResult = (input: OwnRawMove): Result => {
        switch (input) {
            case 'X': {
                return Result.Lose;
            }
            case 'Y': {
                return Result.Draw;
            }
            case 'Z': {
                return Result.Win;
            }
        }
    };

    const determineOwnMove = (adversaryMove: Move, desiredResult: Result): Move => {
        for (const ownMove of Object.values(Move)) {
            if (typeof ownMove === 'string') continue;
            if (roundEvaluationMap[ownMove][adversaryMove] === desiredResult) return ownMove;
        }
        throw new Error('No move found');
    };

    let partTwoScore = 0;
    for (const round of rounds) {
        const [adversaryRawMove, ownRawMove] = round.split(' ') as [AdversaryRawMove, OwnRawMove];
        const adversaryMove = moveDecrypt(adversaryRawMove);
        const desiredResult = getDesiredResult(ownRawMove);
        const ownMove = determineOwnMove(adversaryMove, desiredResult);

        partTwoScore += calculateRoundScore(ownMove, desiredResult);
    }
    console.log('Part two score:', partTwoScore);
};

void main();
