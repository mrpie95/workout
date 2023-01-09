import json


class Exercise:
    def __init__(self, owner, name, weights, bar_mass):
        self._owner = owner
        self._name = name
        self._bar_mass = bar_mass
        self._weights = weights

    def current_mass(self):
        total_mass = sum(
            weight.mass * weight.in_use for weight in self._weights)
        return total_mass + self._bar_mass

    def max_mass(self):
        total_mass = sum(
            weight.mass * weight.count for weight in self._weights)
        return total_mass + self._bar_mass

    def update_available_weights(self, available_weights):
        self._weights = available_weights

    def increment_by_smallest_weight(self):
        self._weights = sorted(self._weights, key=lambda w: w.mass)
        for weight in self._weights:
            if weight.in_use < weight.count:
                weight.in_use += 1
                break


class Weight:
    def __init__(self, mass, count, in_use):
        self.mass = mass
        self.count = count
        self.in_use = in_use

# def on_open():
#     ui = SpreadsheetApp.get_ui()
#     ui.create_menu('Custom Menu').add_item('Save Data', 'save_data').add_to_ui()


def intialise_exercises():
    available_weights = [
        Weight(1.25, 4, 2),
        Weight(2.5, 4, 0),
        Weight(5, 2, 0),
        Weight(10, 2, 0),
        Weight(20, 2, 0),
    ]

    exercises = []
    exercises.append(Exercise('Kyra', 'Bench Press', available_weights, 7))
    # exercises.push(new Exercise('Michael','Bench Press', available_weights, 7))
    # exercises.push(new Exercise('Michael','Shoulder Press', available_weights, 7))

    # sheet = SpreadsheetApp.get_active_spreadsheet().get_sheet_by_name('Ky Data')
    offset = 29

    for exercise in exercises:
        sheet.get_range(f"B{offset}").set_value(json.dumps(exercise))
        offset += 1

# load all exercise and update their weight sets to new weights


def update_available_weights():
    pass


def set_exercises():
    available_weights = [
        Weight(1.25, 4, 4),
        Weight(2.5, 4, 4),
        Weight(5, 2, 2),
        Weight(10, 2, 0),
        Weight(20, 2, 0),
    ]

    bench_press = Exercise('Kyra', 'Bench Press', available_weights, 7)

    # sheet = SpreadsheetApp.get_active_spreadsheet().get_sheet_by_name('Ky Data')

    # sheet.get_range('B29').set_value(json.dumps(bench_press))


def load_exercises():
    # sheet = SpreadsheetApp.get_active_spreadsheet().get_sheet_by_name('Ky Data')
    # my_object = json.loads(sheet.get_range('B29').get_value())
    weights = []

    for weight in my_object['_weights']:
        weights.append(
            Weight(weight['_mass'], weight['_count'], weight['_inUse']))

    exercise = Exercise(
        my_object['_owner'],
        my_object['_name'],
        weights,
        my_object['_barMass']
    )

    # SpreadsheetApp.get_ui().alert(exercise.max_mass())
    # SpreadsheetApp.get_ui().alert(exercise.current_mass())
    # SpreadsheetApp.get_ui().alert(json.dumps(exercise, indent=2))

    # SpreadsheetApp.get_ui().alert(exercise.current_mass())

    exercise.increment_by_smallest_weight()

    # SpreadsheetApp.get_ui().alert(exercise.current_mass())

    # sheet = SpreadsheetApp.get_active_spreadsheet().get_sheet_by_name('Ky Data')

    # sheet.get_range('B29').set_value(json.dumps(exercise, indent=2))
