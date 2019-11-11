using Newtonsoft.Json;
using Sync.Core.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace Sync.Core
{
    public static class KeyboardUtilities
    {
        public static KeyboardModel GetKeyboardModel(string json)
        {
            return JsonConvert.DeserializeObject<KeyboardModel>(json);
        }

        public static async Task<List<KeyboardModel>> GetAvailableKeyboardsAsync()
        {
            List<KeyboardModel> keyboards = new List<KeyboardModel>();

            foreach(var file in Directory.GetFiles("../Sync.Core/Keyboards/", "*.json"))
            {
                using (StreamReader reader = new StreamReader(file))
                {
                    var json = await reader.ReadToEndAsync();
                    keyboards.Add(KeyboardUtilities.GetKeyboardModel(json));
                }
            }

            return keyboards;
        }
    }
}
